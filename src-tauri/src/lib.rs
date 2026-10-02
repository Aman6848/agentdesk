#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                app.handle().plugin(tauri_plugin_log::Builder::default().build())?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running AgentDesk");
}
