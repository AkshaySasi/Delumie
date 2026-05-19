use tokio::process::Command;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use tauri::{AppHandle, Emitter};
use reqwest::Client;
use futures_util::StreamExt;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

// ── Dependency Check + Ollama Auto-Start ─────────────────────────────────────

#[tauri::command]
pub async fn check_dependencies() -> bool {
    // First verify the ollama binary exists
    let has_binary = Command::new("ollama")
        .arg("--version")
        .output()
        .await
        .map(|o| o.status.success())
        .unwrap_or(false);

    if !has_binary {
        return false;
    }

    // Check if the Ollama API is already running
    let client = Client::new();
    if client
        .get("http://localhost:11434/api/tags")
        .send()
        .await
        .map(|r| r.status().is_success())
        .unwrap_or(false)
    {
        return true;
    }

    // Not running — try to start it in the background
    let _ = Command::new("ollama")
        .arg("serve")
        .spawn();

    // Give it up to 4 seconds to come up
    for _ in 0..8 {
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        if client
            .get("http://localhost:11434/api/tags")
            .send()
            .await
            .map(|r| r.status().is_success())
            .unwrap_or(false)
        {
            return true;
        }
    }

    false
}

// ── Installer ─────────────────────────────────────────────────────────────────

#[tauri::command]
pub async fn install_ollama(app: AppHandle) -> Result<String, String> {
    let os = std::env::consts::OS;
    let url = match os {
        "windows" => "https://ollama.com/download/OllamaSetup.exe",
        "macos" => "https://ollama.com/download/Ollama-darwin.zip",
        "linux" => "https://ollama.com/install.sh",
        _ => return Err("Unsupported OS".to_string()),
    };

    let client = Client::new();
    let res = client.get(url).send().await.map_err(|e| e.to_string())?;
    let total_size = res.content_length().unwrap_or(0);

    let temp_dir = std::env::temp_dir();
    let file_name = if os == "windows" { "OllamaSetup.exe" } else { "ollama_installer" };
    let file_path = temp_dir.join(file_name);

    let mut file = File::create(&file_path).await.map_err(|e| e.to_string())?;
    let mut stream = res.bytes_stream();
    let mut downloaded: u64 = 0;

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
        file.write_all(&chunk).await.map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;
        if total_size > 0 {
            let progress = (downloaded as f64 / total_size as f64) * 100.0;
            let _ = app.emit("setup-progress", progress);
        }
    }
    drop(file);

    if os == "windows" {
        let _ = Command::new(&file_path).spawn().map_err(|e| e.to_string())?;
        return Ok("Installer launched".to_string());
    }

    Ok("Download complete".to_string())
}

// ── Model Pull ────────────────────────────────────────────────────────────────

#[tauri::command]
pub async fn pull_model(app: AppHandle, model: String) -> Result<String, String> {
    let client = Client::new();

    // Check if the model already exists
    if let Ok(res) = client.get("http://localhost:11434/api/tags").send().await {
        if res.status().is_success() {
            if let Ok(body) = res.json::<serde_json::Value>().await {
                if let Some(models) = body.get("models").and_then(|v| v.as_array()) {
                    for m in models {
                        if let Some(name) = m.get("name").and_then(|n| n.as_str()) {
                            if name.contains(&*model) {
                                return Ok("Model already exists".to_string());
                            }
                        }
                    }
                }
            }
        }
    }

    let res = client
        .post("http://localhost:11434/api/pull")
        .json(&serde_json::json!({ "model": model, "stream": true }))
        .send()
        .await
        .map_err(|e| format!("Failed to connect to Ollama: {}", e))?;

    if !res.status().is_success() {
        return Err(format!("Ollama API error: {}", res.status()));
    }

    let mut buffer = String::new();
    let mut stream = res.bytes_stream();

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
        buffer.push_str(&String::from_utf8_lossy(&chunk));

        while let Some(pos) = buffer.find('\n') {
            let line = buffer[..pos].to_string();
            buffer = buffer[pos + 1..].to_string();

            if line.trim().is_empty() {
                continue;
            }
            if let Ok(json) = serde_json::from_str::<serde_json::Value>(&line) {
                if let Some(err) = json.get("error").and_then(|e| e.as_str()) {
                    return Err(err.to_string());
                }
                if let (Some(total), Some(completed)) = (
                    json.get("total").and_then(|n| n.as_u64()),
                    json.get("completed").and_then(|n| n.as_u64()),
                ) {
                    if total > 0 {
                        let progress = (completed as f64 / total as f64) * 100.0;
                        let _ = app.emit("setup-progress", progress);
                    }
                }
            }
        }
    }

    Ok("Model pulled successfully".to_string())
}

// ── Streaming Chat ────────────────────────────────────────────────────────────

#[tauri::command]
pub async fn send_chat_message<'a>(
    app: AppHandle,
    model: String,
    messages: Vec<ChatMessage>,
    session_id: String,
    db: tauri::State<'a, crate::database::Database>,
) -> Result<String, String> {
    // Build personalized system prompt
    let profile = db.get_profile().ok().flatten();
    let mut system_prompt = String::from(
        "You are Delumie, a personal AI health companion. \
         Provide SHORT, PERSONAL, empathetic health guidance.\n\n",
    );

    if let Some(ref p) = profile {
        system_prompt.push_str("USER PROFILE:\n");
        if !p.name.is_empty() {
            system_prompt.push_str(&format!("- {}", p.name));
            if p.age > 0 {
                system_prompt.push_str(&format!(", Age {}", p.age));
            }
            if !p.gender.is_empty() {
                system_prompt.push_str(&format!(", {}", p.gender));
            }
            system_prompt.push('\n');
        }
        if !p.goals.is_empty() {
            system_prompt.push_str(&format!("- Goals: {}\n", p.goals));
        }
        if !p.medical_history.is_empty() {
            system_prompt.push_str(&format!("- Medical: {}\n", p.medical_history));
        }
        system_prompt.push('\n');
    }

    system_prompt.push_str(
        "RULES:\n\
        1. Keep answers to 3-5 sentences, conversational tone.\n\
        2. Reference the user's goals and profile when relevant.\n\
        3. For known allergies/conditions: never suggest that allergen/trigger.\n\
        4. If uncertain about anything medical: say 'Please consult your doctor'.\n\
        5. No diagnoses or prescription recommendations.\n\
        6. Focus on lifestyle, nutrition, exercise, and wellbeing.",
    );

    // Use last 10 messages for context
    let recent_count = std::cmp::min(10, messages.len());
    let recent = messages[messages.len() - recent_count..].to_vec();

    // Inject system prompt into the last user message (improves small model compliance)
    let mut full_messages = recent;
    if let Some(last) = full_messages.last_mut() {
        if last.role == "user" {
            let orig = last.content.clone();
            last.content = format!("{}\n\nUser: {}", system_prompt, orig);
        }
    }

    let client = Client::new();
    let res = client
        .post("http://localhost:11434/api/chat")
        .json(&serde_json::json!({
            "model": model,
            "messages": full_messages,
            "stream": true
        }))
        .send()
        .await
        .map_err(|e| {
            let msg = format!("Cannot reach Ollama. Is it running? ({})", e);
            let _ = app.emit("chat-stream-error", &msg);
            msg
        })?;

    if !res.status().is_success() {
        let msg = format!("Ollama API error: {}", res.status());
        let _ = app.emit("chat-stream-error", &msg);
        return Err(msg);
    }

    let mut full_response = String::new();
    let mut buffer = String::new();
    let mut stream = res.bytes_stream();

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| {
            let msg = e.to_string();
            let _ = app.emit("chat-stream-error", &msg);
            msg
        })?;

        buffer.push_str(&String::from_utf8_lossy(&chunk));

        while let Some(pos) = buffer.find('\n') {
            let line = buffer[..pos].to_string();
            buffer = buffer[pos + 1..].to_string();

            if line.trim().is_empty() {
                continue;
            }

            if let Ok(json) = serde_json::from_str::<serde_json::Value>(&line) {
                // Error from Ollama
                if let Some(err) = json.get("error").and_then(|e| e.as_str()) {
                    let _ = app.emit("chat-stream-error", err);
                    return Err(err.to_string());
                }

                // Token content
                if let Some(content) = json
                    .get("message")
                    .and_then(|m| m.get("content"))
                    .and_then(|c| c.as_str())
                {
                    if !content.is_empty() {
                        full_response.push_str(content);
                        let _ = app.emit("chat-token", content);
                    }
                }

                // Stream complete
                if json.get("done").and_then(|d| d.as_bool()).unwrap_or(false) {
                    // Persist to DB
                    let _ = db.save_message(&session_id, "assistant", &full_response);
                    let _ = db.touch_session(&session_id);

                    // Auto-title the session from the first user message
                    if let Some(first_user) = messages.first().filter(|m| m.role == "user") {
                        let title: String = first_user.content.chars().take(40).collect();
                        let title = if first_user.content.len() > 40 {
                            format!("{}…", title)
                        } else {
                            title
                        };
                        let _ = db.update_session_title(&session_id, &title);
                    }

                    let _ = app.emit("chat-stream-done", &full_response);
                    return Ok(full_response);
                }
            }
        }
    }

    // Stream ended without a done=true (shouldn't happen but handle gracefully)
    let _ = db.save_message(&session_id, "assistant", &full_response);
    let _ = db.touch_session(&session_id);
    let _ = app.emit("chat-stream-done", &full_response);
    Ok(full_response)
}
