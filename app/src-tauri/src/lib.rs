mod setup_manager;
mod database;
mod rag;

use database::Database;
use rag::RagSystem;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let handle = app.handle();
            let db = Database::new(handle);
            app.manage(db);
            let rag = RagSystem::new();
            app.manage(rag);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Setup
            setup_manager::check_dependencies,
            setup_manager::install_ollama,
            setup_manager::pull_model,
            setup_manager::send_chat_message,
            // Profile
            rag::save_user_profile,
            rag::get_user_profile,
            // Sessions
            rag::get_chat_sessions,
            rag::create_chat_session,
            rag::delete_chat_session,
            rag::load_session_messages,
            rag::save_user_message,
            // Health
            rag::log_health_metric,
            rag::get_health_logs,
            // RAG / docs
            rag::ingest_document,
            rag::search_knowledge,
            rag::reset_app,
            rag::remove_model,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
