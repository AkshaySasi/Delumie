use tauri::State;
use crate::database::{Database, ChatSession, StoredMessage, HealthLog};
use reqwest::Client;
use serde_json::json;

pub struct RagSystem;

impl RagSystem {
    pub fn new() -> Self {
        RagSystem
    }

    pub async fn embed(&self, text: &str) -> Result<Vec<f32>, String> {
        let client = Client::new();
        let res = client
            .post("http://localhost:11434/api/embeddings")
            .json(&json!({ "model": "nomic-embed-text", "prompt": text }))
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if !res.status().is_success() {
            return Err(format!("Ollama Embedding Error: {}", res.status()));
        }

        let body: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;
        if let Some(embedding) = body.get("embedding").and_then(|e| e.as_array()) {
            let vec: Vec<f32> = embedding
                .iter()
                .filter_map(|v| v.as_f64().map(|f| f as f32))
                .collect();
            if vec.is_empty() {
                return Err("Empty embedding returned".to_string());
            }
            Ok(vec)
        } else {
            Err("Invalid response format".to_string())
        }
    }
}

// ── Profile ───────────────────────────────────────────────────────────────────

#[tauri::command]
pub async fn save_user_profile<'a>(
    profile: crate::database::UserProfile,
    db: State<'a, Database>,
) -> Result<String, String> {
    db.save_profile(&profile).map_err(|e| e.to_string())?;
    Ok("Profile saved".to_string())
}

#[tauri::command]
pub async fn get_user_profile<'a>(
    db: State<'a, Database>,
) -> Result<Option<crate::database::UserProfile>, String> {
    db.get_profile().map_err(|e| e.to_string())
}

// ── Sessions ──────────────────────────────────────────────────────────────────

#[tauri::command]
pub async fn get_chat_sessions<'a>(
    db: State<'a, Database>,
) -> Result<Vec<ChatSession>, String> {
    db.get_sessions().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_chat_session<'a>(
    db: State<'a, Database>,
) -> Result<ChatSession, String> {
    db.create_session().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_chat_session<'a>(
    id: String,
    db: State<'a, Database>,
) -> Result<(), String> {
    db.delete_session(&id).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn load_session_messages<'a>(
    session_id: String,
    db: State<'a, Database>,
) -> Result<Vec<StoredMessage>, String> {
    db.get_session_messages(&session_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn save_user_message<'a>(
    session_id: String,
    content: String,
    db: State<'a, Database>,
) -> Result<StoredMessage, String> {
    db.save_message(&session_id, "user", &content)
        .map_err(|e| e.to_string())
}

// ── Health Logs ───────────────────────────────────────────────────────────────

#[tauri::command]
pub async fn log_health_metric<'a>(
    metric_type: String,
    value: String,
    note: Option<String>,
    db: State<'a, Database>,
) -> Result<HealthLog, String> {
    db.save_health_log(&metric_type, &value, note.as_deref())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_health_logs<'a>(
    metric_type: Option<String>,
    limit: Option<usize>,
    db: State<'a, Database>,
) -> Result<Vec<HealthLog>, String> {
    db.get_health_logs(metric_type.as_deref(), limit.unwrap_or(50))
        .map_err(|e| e.to_string())
}

// ── RAG / Documents ───────────────────────────────────────────────────────────

#[tauri::command]
pub async fn ingest_document<'a>(
    _app_handle: tauri::AppHandle,
    text: String,
    source: String,
    db: State<'a, Database>,
    rag: State<'a, RagSystem>,
) -> Result<String, String> {
    let chunks: Vec<&str> = text.split("\n\n").collect();
    let mut count = 0;
    for chunk in chunks {
        if chunk.trim().is_empty() {
            continue;
        }
        let embedding = rag.embed(chunk).await?;
        db.add_memory(chunk, &source, &embedding).map_err(|e| e.to_string())?;
        count += 1;
    }
    Ok(format!("Processed {} chunks", count))
}

#[tauri::command]
pub async fn search_knowledge<'a>(
    query: String,
    db: State<'a, Database>,
    rag: State<'a, RagSystem>,
) -> Result<Vec<crate::database::Memory>, String> {
    let embedding = rag.embed(&query).await?;
    db.search_memories(&embedding, 5).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn reset_app<'a>(db: State<'a, Database>) -> Result<String, String> {
    db.reset_application().map_err(|e| e.to_string())?;
    Ok("Application reset".to_string())
}

#[tauri::command]
pub async fn remove_model(model_name: String) -> Result<String, String> {
    let output = std::process::Command::new("ollama")
        .args(["rm", &model_name])
        .output()
        .map_err(|e| e.to_string())?;
    if output.status.success() {
        Ok(format!("Model {} removed", model_name))
    } else {
        let err = String::from_utf8_lossy(&output.stderr).to_string();
        Err(err)
    }
}
