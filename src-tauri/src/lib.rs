use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AppSystemInfo {
    pub app_name: String,
    pub version: String,
    pub architecture: String,
    pub memory_optimized: bool,
}

#[tauri::command]
fn get_system_info() -> AppSystemInfo {
    AppSystemInfo {
        app_name: "Chess Mastery".to_string(),
        version: "1.0.0".to_string(),
        architecture: std::env::consts::ARCH.to_string(),
        memory_optimized: true,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_system_info])
        .run(tauri::generate_context!())
        .expect("error while running Chess Mastery application");
}
