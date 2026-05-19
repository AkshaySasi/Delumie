use rusqlite::{params, Connection, Result};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UserProfile {
    pub name: String,
    pub age: u8,
    pub gender: String,
    pub goals: String,
    pub medical_history: String,
    pub model: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChatSession {
    pub id: String,
    pub title: String,
    pub created_at: String,
    pub last_message_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StoredMessage {
    pub id: i64,
    pub session_id: String,
    pub role: String,
    pub content: String,
    pub created_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HealthLog {
    pub id: i64,
    pub metric_type: String,
    pub value: String,
    pub note: Option<String>,
    pub logged_at: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Memory {
    pub id: String,
    pub content: String,
    pub source: String,
    pub created_at: String,
}

#[derive(Clone)]
pub struct Database {
    db_path: PathBuf,
}

impl Database {
    pub fn new(app_handle: &AppHandle) -> Self {
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .expect("failed to get app data dir");
        fs::create_dir_all(&app_dir).expect("failed to create app data dir");
        let db_path = app_dir.join("delumie.db");
        let db = Database { db_path };
        db.init().expect("failed to initialize database");
        db
    }

    fn init(&self) -> Result<()> {
        let conn = Connection::open(&self.db_path)?;

        conn.execute_batch("PRAGMA foreign_keys = ON;")?;

        // Users
        conn.execute(
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                age INTEGER,
                gender TEXT,
                goals TEXT,
                medical_history TEXT
            )",
            [],
        )?;
        let _ = conn.execute("ALTER TABLE users ADD COLUMN model TEXT DEFAULT 'llama3.2:3b'", []);

        // Memories (RAG vector store)
        conn.execute(
            "CREATE TABLE IF NOT EXISTS memories (
                id TEXT PRIMARY KEY,
                content TEXT NOT NULL,
                source TEXT NOT NULL,
                embedding BLOB NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        // Chat sessions
        conn.execute(
            "CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL DEFAULT 'New Chat',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                last_message_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        // Messages per session
        conn.execute(
            "CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
            )",
            [],
        )?;

        // Health logs
        conn.execute(
            "CREATE TABLE IF NOT EXISTS health_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                metric_type TEXT NOT NULL,
                value TEXT NOT NULL,
                note TEXT,
                logged_at TEXT DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        Ok(())
    }

    // ── User Profile ─────────────────────────────────────────────────────────

    pub fn save_profile(&self, profile: &UserProfile) -> Result<()> {
        let conn = Connection::open(&self.db_path)?;
        conn.execute("DELETE FROM users", [])?;
        conn.execute(
            "INSERT INTO users (name, age, gender, goals, medical_history, model)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                profile.name, profile.age, profile.gender,
                profile.goals, profile.medical_history, profile.model
            ],
        )?;
        Ok(())
    }

    pub fn get_profile(&self) -> Result<Option<UserProfile>> {
        let conn = Connection::open(&self.db_path)?;
        let mut stmt = conn.prepare(
            "SELECT name, age, gender, goals, medical_history, model FROM users LIMIT 1",
        )?;
        let mut rows = stmt.query([])?;
        if let Some(row) = rows.next()? {
            Ok(Some(UserProfile {
                name: row.get(0)?,
                age: row.get(1)?,
                gender: row.get(2)?,
                goals: row.get(3)?,
                medical_history: row.get(4)?,
                model: row.get(5).unwrap_or_else(|_| "llama3.2:3b".to_string()),
            }))
        } else {
            Ok(None)
        }
    }

    // ── Sessions ──────────────────────────────────────────────────────────────

    pub fn create_session(&self) -> Result<ChatSession> {
        let conn = Connection::open(&self.db_path)?;
        let id = uuid::Uuid::new_v4().to_string();
        conn.execute(
            "INSERT INTO sessions (id, title) VALUES (?1, 'New Chat')",
            params![id],
        )?;
        let mut stmt = conn.prepare(
            "SELECT id, title, created_at, last_message_at FROM sessions WHERE id = ?1",
        )?;
        let session = stmt.query_row(params![id], |row| {
            Ok(ChatSession {
                id: row.get(0)?,
                title: row.get(1)?,
                created_at: row.get(2)?,
                last_message_at: row.get(3)?,
            })
        })?;
        Ok(session)
    }

    pub fn get_sessions(&self) -> Result<Vec<ChatSession>> {
        let conn = Connection::open(&self.db_path)?;
        let mut stmt = conn.prepare(
            "SELECT id, title, created_at, last_message_at FROM sessions
             ORDER BY last_message_at DESC LIMIT 100",
        )?;
        let rows = stmt.query_map([], |row| {
            Ok(ChatSession {
                id: row.get(0)?,
                title: row.get(1)?,
                created_at: row.get(2)?,
                last_message_at: row.get(3)?,
            })
        })?;
        rows.collect()
    }

    pub fn delete_session(&self, id: &str) -> Result<()> {
        let conn = Connection::open(&self.db_path)?;
        conn.execute("DELETE FROM sessions WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn update_session_title(&self, id: &str, title: &str) -> Result<()> {
        let conn = Connection::open(&self.db_path)?;
        conn.execute(
            "UPDATE sessions SET title = ?1 WHERE id = ?2",
            params![title, id],
        )?;
        Ok(())
    }

    pub fn touch_session(&self, id: &str) -> Result<()> {
        let conn = Connection::open(&self.db_path)?;
        conn.execute(
            "UPDATE sessions SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?1",
            params![id],
        )?;
        Ok(())
    }

    // ── Messages ──────────────────────────────────────────────────────────────

    pub fn save_message(&self, session_id: &str, role: &str, content: &str) -> Result<StoredMessage> {
        let conn = Connection::open(&self.db_path)?;
        conn.execute(
            "INSERT INTO messages (session_id, role, content) VALUES (?1, ?2, ?3)",
            params![session_id, role, content],
        )?;
        let id = conn.last_insert_rowid();
        let mut stmt = conn.prepare(
            "SELECT id, session_id, role, content, created_at FROM messages WHERE id = ?1",
        )?;
        let msg = stmt.query_row(params![id], |row| {
            Ok(StoredMessage {
                id: row.get(0)?,
                session_id: row.get(1)?,
                role: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
            })
        })?;
        Ok(msg)
    }

    pub fn get_session_messages(&self, session_id: &str) -> Result<Vec<StoredMessage>> {
        let conn = Connection::open(&self.db_path)?;
        let mut stmt = conn.prepare(
            "SELECT id, session_id, role, content, created_at FROM messages
             WHERE session_id = ?1 ORDER BY id ASC",
        )?;
        let rows = stmt.query_map(params![session_id], |row| {
            Ok(StoredMessage {
                id: row.get(0)?,
                session_id: row.get(1)?,
                role: row.get(2)?,
                content: row.get(3)?,
                created_at: row.get(4)?,
            })
        })?;
        rows.collect()
    }

    // ── Health Logs ───────────────────────────────────────────────────────────

    pub fn save_health_log(
        &self,
        metric_type: &str,
        value: &str,
        note: Option<&str>,
    ) -> Result<HealthLog> {
        let conn = Connection::open(&self.db_path)?;
        conn.execute(
            "INSERT INTO health_logs (metric_type, value, note) VALUES (?1, ?2, ?3)",
            params![metric_type, value, note],
        )?;
        let id = conn.last_insert_rowid();
        let mut stmt = conn.prepare(
            "SELECT id, metric_type, value, note, logged_at FROM health_logs WHERE id = ?1",
        )?;
        let log = stmt.query_row(params![id], |row| {
            Ok(HealthLog {
                id: row.get(0)?,
                metric_type: row.get(1)?,
                value: row.get(2)?,
                note: row.get(3)?,
                logged_at: row.get(4)?,
            })
        })?;
        Ok(log)
    }

    pub fn get_health_logs(
        &self,
        metric_type: Option<&str>,
        limit: usize,
    ) -> Result<Vec<HealthLog>> {
        let conn = Connection::open(&self.db_path)?;
        let (sql, param): (&str, Box<dyn rusqlite::ToSql>) = if let Some(mt) = metric_type {
            (
                "SELECT id, metric_type, value, note, logged_at FROM health_logs
                 WHERE metric_type = ?1 ORDER BY logged_at DESC LIMIT ?2",
                Box::new(mt.to_string()),
            )
        } else {
            (
                "SELECT id, metric_type, value, note, logged_at FROM health_logs
                 ORDER BY logged_at DESC LIMIT ?2",
                Box::new(""),
            )
        };

        // Simpler: separate query paths
        if let Some(mt) = metric_type {
            let mut stmt = conn.prepare(
                "SELECT id, metric_type, value, note, logged_at FROM health_logs
                 WHERE metric_type = ?1 ORDER BY logged_at DESC LIMIT ?2",
            )?;
            let rows = stmt.query_map(params![mt, limit as i64], |row| {
                Ok(HealthLog {
                    id: row.get(0)?,
                    metric_type: row.get(1)?,
                    value: row.get(2)?,
                    note: row.get(3)?,
                    logged_at: row.get(4)?,
                })
            })?;
            let _ = sql; let _ = param;
            return rows.collect();
        }

        let mut stmt = conn.prepare(
            "SELECT id, metric_type, value, note, logged_at FROM health_logs
             ORDER BY logged_at DESC LIMIT ?1",
        )?;
        let rows = stmt.query_map(params![limit as i64], |row| {
            Ok(HealthLog {
                id: row.get(0)?,
                metric_type: row.get(1)?,
                value: row.get(2)?,
                note: row.get(3)?,
                logged_at: row.get(4)?,
            })
        })?;
        rows.collect()
    }

    // ── RAG Memories ──────────────────────────────────────────────────────────

    pub fn add_memory(&self, content: &str, source: &str, embedding: &[f32]) -> Result<()> {
        let conn = Connection::open(&self.db_path)?;
        let id = uuid::Uuid::new_v4().to_string();
        let embedding_bytes: &[u8] = bytemuck::cast_slice(embedding);
        conn.execute(
            "INSERT INTO memories (id, content, source, embedding) VALUES (?1, ?2, ?3, ?4)",
            params![id, content, source, embedding_bytes],
        )?;
        Ok(())
    }

    pub fn search_memories(
        &self,
        query_embedding: &[f32],
        limit: usize,
    ) -> Result<Vec<Memory>> {
        let conn = Connection::open(&self.db_path)?;
        let mut stmt = conn.prepare(
            "SELECT id, content, source, created_at, embedding FROM memories",
        )?;
        let rows = stmt.query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, String>(3)?,
                row.get::<_, Vec<u8>>(4)?,
            ))
        })?;

        let mut scored: Vec<(f32, Memory)> = Vec::new();
        for row in rows {
            let (id, content, source, created_at, blob) = row?;
            let embedding: &[f32] = bytemuck::cast_slice(&blob);
            let score = cosine_similarity(query_embedding, embedding);
            scored.push((score, Memory { id, content, source, created_at }));
        }
        scored.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap_or(std::cmp::Ordering::Equal));
        Ok(scored.into_iter().take(limit).map(|(_, m)| m).collect())
    }

    // ── Reset ─────────────────────────────────────────────────────────────────

    pub fn reset_application(&self) -> Result<()> {
        let conn = Connection::open(&self.db_path)?;
        conn.execute("DELETE FROM users", [])?;
        conn.execute("DELETE FROM memories", [])?;
        conn.execute("DELETE FROM sessions", [])?;
        conn.execute("DELETE FROM health_logs", [])?;
        Ok(())
    }
}

fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    if a.len() != b.len() {
        return 0.0;
    }
    let dot: f32 = a.iter().zip(b).map(|(x, y)| x * y).sum();
    let mag_a: f32 = a.iter().map(|x| x * x).sum::<f32>().sqrt();
    let mag_b: f32 = b.iter().map(|y| y * y).sum::<f32>().sqrt();
    if mag_a == 0.0 || mag_b == 0.0 {
        return 0.0;
    }
    dot / (mag_a * mag_b)
}
