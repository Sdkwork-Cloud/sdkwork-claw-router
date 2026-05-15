use sdkwork_claw_config::{
    DatabaseConfig, DatabaseEngine, RuntimeConfigLocation, RuntimeConfigProfile, StartupInstallMode,
};
use std::env;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

static ENV_LOCK: Mutex<()> = Mutex::new(());

#[test]
fn parses_sqlite_database_urls_for_desktop_deployment() {
    let config = DatabaseConfig::from_url("sqlite::memory:").unwrap();

    assert_eq!(DatabaseEngine::Sqlite, config.engine);
    assert_eq!("sqlite::memory:", config.url);
    assert_eq!(
        DatabaseConfig::DEFAULT_MAX_CONNECTIONS,
        config.max_connections
    );
}

#[test]
fn parses_postgres_database_urls_for_server_docker_and_kubernetes() {
    let config = DatabaseConfig::from_url_with_max_connections(
        "postgres://sdkwork:sdkwork@localhost:5432/sdkwork_claw_router",
        32,
    )
    .unwrap();

    assert_eq!(DatabaseEngine::Postgres, config.engine);
    assert_eq!(32, config.max_connections);
}

#[test]
fn rejects_unsupported_or_empty_database_urls() {
    assert!(DatabaseConfig::from_url("").is_err());
    assert!(DatabaseConfig::from_url("mysql://localhost/sdkwork").is_err());
}

#[test]
fn rejects_zero_database_pool_size() {
    let error = DatabaseConfig::from_url_with_max_connections("sqlite::memory:", 0).unwrap_err();

    assert!(error.contains("max connections"));
}

#[test]
fn parses_optional_environment_database_config_parts() {
    assert_eq!(
        None,
        DatabaseConfig::from_optional_parts(None, None).unwrap()
    );

    let config = DatabaseConfig::from_optional_parts(
        Some("sqlite::memory:".to_owned()),
        Some("4".to_owned()),
    )
    .unwrap()
    .unwrap();

    assert_eq!(DatabaseEngine::Sqlite, config.engine);
    assert_eq!(4, config.max_connections);
}

#[test]
fn rejects_invalid_environment_database_pool_size() {
    let error = DatabaseConfig::from_optional_parts(
        Some("sqlite::memory:".to_owned()),
        Some("bad".to_owned()),
    )
    .unwrap_err();

    assert!(error.contains("SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS"));
}

#[test]
fn reads_database_config_from_runtime_toml_file() {
    let config_path = write_temp_config(
        "server-postgres",
        r#"
[database]
engine = "postgresql"
url = "postgresql://sdkwork:sdkwork@db.internal:5432/sdkwork_claw_router"
max_connections = 24
"#,
    );

    let config = DatabaseConfig::from_config_file(&config_path)
        .unwrap()
        .unwrap();

    assert_eq!(DatabaseEngine::Postgres, config.engine);
    assert_eq!(
        "postgresql://sdkwork:sdkwork@db.internal:5432/sdkwork_claw_router",
        config.url
    );
    assert_eq!(24, config.max_connections);
}

#[test]
fn runtime_config_file_supports_sqlite_desktop_defaults() {
    let config_path = write_temp_config(
        "desktop-sqlite",
        r#"
[database]
engine = "sqlite"
url = "sqlite:///Users/example/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.sqlite"
max_connections = 1
"#,
    );

    let config = DatabaseConfig::from_config_file(&config_path)
        .unwrap()
        .unwrap();

    assert_eq!(DatabaseEngine::Sqlite, config.engine);
    assert_eq!(1, config.max_connections);
    assert!(config.url.ends_with("sdkwork-claw-router.sqlite"));
}

#[test]
fn runtime_config_file_accepts_standard_toml_literal_strings() {
    let config = DatabaseConfig::from_runtime_config_toml(
        r#"
[database]
engine = 'postgresql'
url = 'postgresql://sdkwork:sdkwork@db.internal:5432/sdkwork_claw_router'
max_connections = 18
"#,
    )
    .unwrap();

    assert_eq!(DatabaseEngine::Postgres, config.engine);
    assert_eq!(
        "postgresql://sdkwork:sdkwork@db.internal:5432/sdkwork_claw_router",
        config.url
    );
    assert_eq!(18, config.max_connections);
}

#[test]
fn environment_database_parts_override_runtime_config_file() {
    let _env_lock = ENV_LOCK.lock().unwrap();
    let config_path = write_temp_config(
        "env-overrides",
        r#"
[database]
engine = "postgresql"
url = "postgresql://file:file@db.internal:5432/file_db"
max_connections = 16
"#,
    );

    let env = [
        (
            "SDKWORK_CLAW_CONFIG_FILE",
            Some(config_path.to_string_lossy().to_string()),
        ),
        (
            "SDKWORK_CLAW_DATABASE_URL",
            Some("sqlite::memory:".to_owned()),
        ),
        (
            "SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS",
            Some("3".to_owned()),
        ),
    ];
    let _guard = EnvGuard::set(&env);

    let config = DatabaseConfig::from_env().unwrap().unwrap();

    assert_eq!(DatabaseEngine::Sqlite, config.engine);
    assert_eq!("sqlite::memory:", config.url);
    assert_eq!(3, config.max_connections);
}

#[test]
fn explicit_runtime_config_file_is_used_when_database_env_is_absent() {
    let _env_lock = ENV_LOCK.lock().unwrap();
    let config_path = write_temp_config(
        "explicit-file",
        r#"
[database]
engine = "postgresql"
url = "postgresql://file:file@db.internal:5432/file_db"
max_connections = 12
"#,
    );
    let _guard = EnvGuard::set(&[
        (
            "SDKWORK_CLAW_CONFIG_FILE",
            Some(config_path.to_string_lossy().to_string()),
        ),
        ("SDKWORK_CLAW_DATABASE_URL", None),
        ("SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS", None),
    ]);

    let config = DatabaseConfig::from_env().unwrap().unwrap();

    assert_eq!(DatabaseEngine::Postgres, config.engine);
    assert_eq!(
        "postgresql://file:file@db.internal:5432/file_db",
        config.url
    );
    assert_eq!(12, config.max_connections);
}

#[test]
fn runtime_config_locations_follow_platform_conventions() {
    let linux_server = RuntimeConfigLocation::for_platform("linux", RuntimeConfigProfile::Server);
    assert_eq!(
        PathBuf::from("/etc/sdkwork-claw-router/sdkwork-claw-router.toml"),
        linux_server.config_file
    );
    assert_eq!(
        PathBuf::from("/var/lib/sdkwork-claw-router"),
        linux_server.data_directory
    );

    let linux_desktop = RuntimeConfigLocation::for_platform("linux", RuntimeConfigProfile::Desktop);
    assert_eq!(
        PathBuf::from("${XDG_CONFIG_HOME:-~/.config}/sdkwork-claw-router/sdkwork-claw-router.toml"),
        linux_desktop.config_file
    );
    assert_eq!(
        PathBuf::from("${XDG_DATA_HOME:-~/.local/share}/sdkwork-claw-router"),
        linux_desktop.data_directory
    );

    let windows_server =
        RuntimeConfigLocation::for_platform("windows", RuntimeConfigProfile::Server);
    assert_eq!(
        PathBuf::from("%ProgramData%/SdkWork/Claw Router/sdkwork-claw-router.toml"),
        windows_server.config_file
    );

    let windows_desktop =
        RuntimeConfigLocation::for_platform("windows", RuntimeConfigProfile::Desktop);
    assert_eq!(
        PathBuf::from("%APPDATA%/SdkWork/Claw Router/sdkwork-claw-router.toml"),
        windows_desktop.config_file
    );
    assert_eq!(
        PathBuf::from("%LOCALAPPDATA%/SdkWork/Claw Router"),
        windows_desktop.data_directory
    );

    let macos_desktop = RuntimeConfigLocation::for_platform("macos", RuntimeConfigProfile::Desktop);
    assert_eq!(
        PathBuf::from("~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml"),
        macos_desktop.config_file
    );
}

#[test]
fn runtime_config_locations_resolve_to_real_os_paths_for_process_lookup() {
    let windows_server = RuntimeConfigLocation::for_platform_resolved(
        "windows",
        RuntimeConfigProfile::Server,
        |key| match key {
            "ProgramData" => Some("C:/ProgramData".to_owned()),
            _ => None,
        },
    );
    assert_eq!(
        "C:/ProgramData/SdkWork/Claw Router/sdkwork-claw-router.toml",
        slash_path(&windows_server.config_file)
    );

    let windows_desktop = RuntimeConfigLocation::for_platform_resolved(
        "windows",
        RuntimeConfigProfile::Desktop,
        |key| match key {
            "APPDATA" => Some("C:/Users/Ada/AppData/Roaming".to_owned()),
            "LOCALAPPDATA" => Some("C:/Users/Ada/AppData/Local".to_owned()),
            _ => None,
        },
    );
    assert_eq!(
        "C:/Users/Ada/AppData/Roaming/SdkWork/Claw Router/sdkwork-claw-router.toml",
        slash_path(&windows_desktop.config_file)
    );
    assert_eq!(
        "C:/Users/Ada/AppData/Local/SdkWork/Claw Router",
        slash_path(&windows_desktop.data_directory)
    );

    let linux_desktop = RuntimeConfigLocation::for_platform_resolved(
        "linux",
        RuntimeConfigProfile::Desktop,
        |key| match key {
            "XDG_CONFIG_HOME" => Some("/home/ada/.config-xdg".to_owned()),
            "XDG_DATA_HOME" => Some("/home/ada/.data-xdg".to_owned()),
            "HOME" => Some("/home/ada".to_owned()),
            _ => None,
        },
    );
    assert_eq!(
        "/home/ada/.config-xdg/sdkwork-claw-router/sdkwork-claw-router.toml",
        slash_path(&linux_desktop.config_file)
    );
    assert_eq!(
        "/home/ada/.data-xdg/sdkwork-claw-router",
        slash_path(&linux_desktop.data_directory)
    );

    let linux_desktop_fallback = RuntimeConfigLocation::for_platform_resolved(
        "linux",
        RuntimeConfigProfile::Desktop,
        |key| match key {
            "HOME" => Some("/home/ada".to_owned()),
            _ => None,
        },
    );
    assert_eq!(
        "/home/ada/.config/sdkwork-claw-router/sdkwork-claw-router.toml",
        slash_path(&linux_desktop_fallback.config_file)
    );
    assert_eq!(
        "/home/ada/.local/share/sdkwork-claw-router",
        slash_path(&linux_desktop_fallback.data_directory)
    );

    let macos_desktop = RuntimeConfigLocation::for_platform_resolved(
        "macos",
        RuntimeConfigProfile::Desktop,
        |key| match key {
            "HOME" => Some("/Users/ada".to_owned()),
            _ => None,
        },
    );
    assert_eq!(
        "/Users/ada/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml",
        slash_path(&macos_desktop.config_file)
    );
}

#[test]
fn parses_startup_install_mode_from_optional_environment_part() {
    assert_eq!(
        StartupInstallMode::Ensure,
        StartupInstallMode::from_optional_part(None).unwrap()
    );
    assert_eq!(
        StartupInstallMode::Ensure,
        StartupInstallMode::from_optional_part(Some("ensure".to_owned())).unwrap()
    );
    assert_eq!(
        StartupInstallMode::Skip,
        StartupInstallMode::from_optional_part(Some("SKIP".to_owned())).unwrap()
    );
    assert!(
        StartupInstallMode::from_optional_part(Some("repair".to_owned()))
            .unwrap_err()
            .contains("SDKWORK_CLAW_STARTUP_INSTALL_MODE")
    );
}

fn write_temp_config(label: &str, content: &str) -> PathBuf {
    let mut root = env::temp_dir();
    root.push("sdkwork-claw-config-tests");
    root.push(format!(
        "{}-{}",
        label,
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos()
    ));
    fs::create_dir_all(&root).unwrap();
    let path = root.join("sdkwork-claw-router.toml");
    fs::write(&path, content.trim()).unwrap();
    path
}

fn slash_path(path: &PathBuf) -> String {
    path.to_string_lossy().replace('\\', "/")
}

struct EnvGuard {
    previous: Vec<(&'static str, Option<String>)>,
}

impl EnvGuard {
    fn set(values: &[(&'static str, Option<String>)]) -> Self {
        let previous = values
            .iter()
            .map(|(key, _)| (*key, env::var(key).ok()))
            .collect::<Vec<_>>();
        for (key, value) in values {
            match value {
                Some(value) => env::set_var(key, value),
                None => env::remove_var(key),
            }
        }
        Self { previous }
    }
}

impl Drop for EnvGuard {
    fn drop(&mut self) {
        for (key, value) in &self.previous {
            match value {
                Some(value) => env::set_var(key, value),
                None => env::remove_var(key),
            }
        }
    }
}
