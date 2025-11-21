// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::os::windows::process::CommandExt;
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use tauri::path::BaseDirectory;
use tauri::{Manager, Window, WindowEvent};

#[derive(Default)]
struct AppState {
    mediamtx_process: Arc<Mutex<Option<Child>>>,
    mediamtx_started: Arc<Mutex<bool>>,
}

#[tauri::command]
async fn start_mediamtx(
    app_state: tauri::State<'_, AppState>,
    handle: tauri::AppHandle,
) -> Result<String, String> {
    // 获取 mediamtx 的路径
    let mediamtx_path = handle
        .path()
        .resolve(
            "mediamtx_v1.14.0_windows_amd64/mediamtx.exe",
            BaseDirectory::Resource,
        )
        .map_err(|e| e.to_string())?;
    let yml_path = handle
        .path()
        .resolve("mediamtx.yml", BaseDirectory::Resource)
        .map_err(|e| e.to_string())?;

    const CREATE_NO_WINDOW: u32 = 0x08000000;
    // const DETACHED_PROCESS: u32 = 0x00000008;

    // 启动 mediamtx 进程
    let process = Command::new(&mediamtx_path)
        .creation_flags(CREATE_NO_WINDOW)
        .arg(&yml_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Failed to start mediamtx");

    // 将进程句柄保存到 AppState
    let mut mediamtx_process = app_state.mediamtx_process.lock().unwrap();
    *mediamtx_process = Some(process);

    let mut mediamtx_started = app_state.mediamtx_started.lock().unwrap();
    *mediamtx_started = true;

    Ok("Mediamtx process started.".into())
}

#[tauri::command]
async fn stop_mediamtx(app_state: tauri::State<'_, AppState>) -> Result<String, String> {
    let mut mediamtx_process = app_state.mediamtx_process.lock().unwrap();

    if let Some(mut process) = mediamtx_process.take() {
        // 通过 .kill() 方法停止进程
        match process.kill() {
            Ok(_) => {
                let mut mediamtx_started = app_state.mediamtx_started.lock().unwrap();
                *mediamtx_started = false;

                Ok("Mediamtx process stopped successfully.".into())
            }
            Err(e) => Err(format!("Failed to stop Mediamtx: {}", e)),
        }
    } else {
        Err("No Mediamtx process found".into())
    }
}

#[tauri::command]
fn window_event(window: &Window, event: &WindowEvent) {
    match event {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            let app_handle = window.app_handle().clone();

            let _state = app_handle.state::<AppState>();

            let mediamtx_started = *_state.mediamtx_started.lock().unwrap();
            if !mediamtx_started {
                return;
            };
            //阻止默认关闭
            api.prevent_close();

            let _window = window.clone();
            //异步关闭mediamtx
            tauri::async_runtime::spawn(async move {
                let app_state = app_handle.state::<AppState>();
                let result = stop_mediamtx(app_state.clone()).await;
                match result {
                    Ok(message) => {
                        println!("{}", message);
                        _window.close().unwrap();
                    }
                    Err(e) => {
                        eprintln!("Error stopping mediamtx: {}", e);
                        _window.close().unwrap();
                    }
                }
            });
        }
        _ => {} //todo
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            app.manage(AppState::default());
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_mediamtx, stop_mediamtx])
        .on_window_event(window_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
