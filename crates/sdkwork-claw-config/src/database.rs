use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DatabaseEngine {
    Sqlite,
    Postgres,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub engine: DatabaseEngine,
    pub url: String,
    pub max_connections: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RuntimeConfigProfile {
    Server,
    Desktop,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RuntimeConfigLocation {
    pub config_file: PathBuf,
    pub data_directory: PathBuf,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RuntimeConfigInitializationAction {
    Existing,
    Created,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RuntimeConfigInitializationReport {
    pub profile: RuntimeConfigProfile,
    pub location: RuntimeConfigLocation,
    pub action: RuntimeConfigInitializationAction,
    pub database: DatabaseConfig,
}

#[derive(Debug, Deserialize)]
struct RuntimeConfigFile {
    database: RuntimeDatabaseConfig,
}

#[derive(Debug, Deserialize)]
struct RuntimeDatabaseConfig {
    engine: Option<String>,
    url: String,
    max_connections: Option<u32>,
}

impl DatabaseConfig {
    pub const DEFAULT_MAX_CONNECTIONS: u32 = 16;
    pub const ENV_CONFIG_FILE: &'static str = "SDKWORK_CLAW_CONFIG_FILE";
    pub const SERVER_DEFAULT_POSTGRES_URL: &'static str =
        "postgresql://sdkwork_claw_router:change-me@localhost:5432/sdkwork_claw_router";

    pub fn from_url(url: impl Into<String>) -> Result<Self, String> {
        Self::from_url_with_max_connections(url, Self::DEFAULT_MAX_CONNECTIONS)
    }

    pub fn from_url_with_max_connections(
        url: impl Into<String>,
        max_connections: u32,
    ) -> Result<Self, String> {
        if max_connections == 0 {
            return Err("database max connections must be greater than zero".to_owned());
        }

        let url = url.into();
        let engine = DatabaseEngine::from_url(&url)?;
        Ok(Self {
            engine,
            url,
            max_connections,
        })
    }

    pub fn from_optional_parts(
        database_url: Option<String>,
        max_connections: Option<String>,
    ) -> Result<Option<Self>, String> {
        let Some(database_url) = database_url else {
            return Ok(None);
        };

        let max_connections = match max_connections {
            Some(value) => value.parse::<u32>().map_err(|_| {
                format!("SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS must be a positive integer: {value}")
            })?,
            None => Self::DEFAULT_MAX_CONNECTIONS,
        };

        Self::from_url_with_max_connections(database_url, max_connections).map(Some)
    }

    pub fn from_env() -> Result<Option<Self>, String> {
        let env_config = Self::from_optional_parts(
            std::env::var("SDKWORK_CLAW_DATABASE_URL").ok(),
            std::env::var("SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS").ok(),
        )?;
        if env_config.is_some() {
            return Ok(env_config);
        }

        if let Some(config_file) = explicit_runtime_config_file() {
            return Self::from_config_file(config_file);
        }

        let location =
            RuntimeConfigLocation::for_current_platform(runtime_config_profile_from_env());
        if location.config_file.exists() {
            return Self::from_config_file(location.config_file);
        }

        Ok(None)
    }

    pub fn from_env_or_initialize() -> Result<Option<Self>, String> {
        let profile = runtime_config_profile_from_env();
        let location = Self::runtime_config_location_from_env(profile);
        let env_config = Self::from_optional_parts(
            std::env::var("SDKWORK_CLAW_DATABASE_URL").ok(),
            std::env::var("SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS").ok(),
        )?;
        if let Some(config) = env_config {
            config.validate_for_runtime_profile_at(profile, &location)?;
            return Ok(Some(config));
        }

        let report = Self::initialize_default_runtime_config_at(profile, &location)?;
        report
            .database
            .validate_for_runtime_profile_at(profile, &report.location)?;
        Ok(Some(report.database))
    }

    pub fn runtime_config_location_from_env(
        profile: RuntimeConfigProfile,
    ) -> RuntimeConfigLocation {
        let default_location = RuntimeConfigLocation::for_current_platform(profile);
        if let Some(config_file) = explicit_runtime_config_file() {
            RuntimeConfigLocation {
                config_file,
                data_directory: default_location.data_directory,
            }
        } else {
            default_location
        }
    }

    pub fn initialize_default_runtime_config(
        profile: RuntimeConfigProfile,
    ) -> Result<RuntimeConfigInitializationReport, String> {
        let location = Self::runtime_config_location_from_env(profile);
        Self::initialize_default_runtime_config_at(profile, &location)
    }

    pub fn initialize_default_runtime_config_at(
        profile: RuntimeConfigProfile,
        location: &RuntimeConfigLocation,
    ) -> Result<RuntimeConfigInitializationReport, String> {
        if location.config_file.exists() {
            let database = Self::from_config_file(&location.config_file)?.ok_or_else(|| {
                format!(
                    "runtime TOML {} did not contain a database configuration",
                    location.config_file.display()
                )
            })?;
            return Ok(RuntimeConfigInitializationReport {
                profile,
                location: location.clone(),
                action: RuntimeConfigInitializationAction::Existing,
                database,
            });
        }

        if let Some(parent) = location
            .config_file
            .parent()
            .filter(|path| !path.as_os_str().is_empty())
        {
            std::fs::create_dir_all(parent).map_err(|error| {
                format!(
                    "failed to create runtime config directory {}: {error}\n{}",
                    parent.display(),
                    Self::startup_help_text(profile)
                )
            })?;
        }
        std::fs::create_dir_all(&location.data_directory).map_err(|error| {
            format!(
                "failed to create runtime data directory {}: {error}\n{}",
                location.data_directory.display(),
                Self::startup_help_text(profile)
            )
        })?;

        let database = Self::default_runtime_database_config(profile, location)?;
        let content = Self::default_runtime_config_toml(profile, location)?;
        std::fs::write(&location.config_file, content).map_err(|error| {
            format!(
                "failed to write runtime TOML {}: {error}\n{}",
                location.config_file.display(),
                Self::startup_help_text(profile)
            )
        })?;

        Ok(RuntimeConfigInitializationReport {
            profile,
            location: location.clone(),
            action: RuntimeConfigInitializationAction::Created,
            database,
        })
    }

    pub fn default_runtime_config_toml(
        profile: RuntimeConfigProfile,
        location: &RuntimeConfigLocation,
    ) -> Result<String, String> {
        let database = Self::default_runtime_database_config(profile, location)?;
        let engine = match database.engine {
            DatabaseEngine::Sqlite => "sqlite",
            DatabaseEngine::Postgres => "postgresql",
        };
        let deployment_mode = match profile {
            RuntimeConfigProfile::Server => "server",
            RuntimeConfigProfile::Desktop => "desktop",
        };
        let mut lines = vec![
            "# SdkWork Claw Router runtime configuration.".to_owned(),
            "# This file was initialized automatically; edit [database].url for the target environment.".to_owned(),
            format!(
                "# Runtime config file: {}",
                location.config_file.display()
            ),
            String::new(),
        ];
        if profile == RuntimeConfigProfile::Server {
            lines.push(
                "# Server/service deployments run with local SQLite by default for quick single-node installs."
                    .to_owned(),
            );
            lines.push(
                "# For production or multi-node deployments, set [database].engine to \"postgresql\" and replace [database].url with a managed PostgreSQL DSN."
                    .to_owned(),
            );
            lines.push(format!(
                "# Default SQLite file: {}",
                location.sqlite_database_path().display()
            ));
            lines.push(String::new());
        } else {
            lines.push("# Desktop deployments default to a local SQLite database.".to_owned());
            lines.push(format!(
                "# Default SQLite file: {}",
                location.sqlite_database_path().display()
            ));
            lines.push(String::new());
        }
        lines.extend([
            "[database]".to_owned(),
            format!("engine = \"{engine}\""),
            format!("url = \"{}\"", toml_string(&database.url)),
            format!("max_connections = {}", database.max_connections),
            String::new(),
            "[paths]".to_owned(),
            format!(
                "data_directory = \"{}\"",
                toml_string(&portable_path(&location.data_directory))
            ),
            String::new(),
            "[runtime]".to_owned(),
            format!("deployment_mode = \"{deployment_mode}\""),
            String::new(),
        ]);
        Ok(lines.join("\n"))
    }

    pub fn default_runtime_database_config(
        profile: RuntimeConfigProfile,
        location: &RuntimeConfigLocation,
    ) -> Result<Self, String> {
        match profile {
            RuntimeConfigProfile::Server => Self::from_url_with_max_connections(
                format!(
                    "sqlite://{}",
                    portable_path(&location.sqlite_database_path())
                ),
                1,
            ),
            RuntimeConfigProfile::Desktop => Self::from_url_with_max_connections(
                format!(
                    "sqlite://{}",
                    portable_path(&location.sqlite_database_path())
                ),
                1,
            ),
        }
    }

    pub fn validate_for_runtime_profile_at(
        &self,
        profile: RuntimeConfigProfile,
        location: &RuntimeConfigLocation,
    ) -> Result<(), String> {
        if profile != RuntimeConfigProfile::Server {
            return Ok(());
        }
        if self.engine == DatabaseEngine::Postgres
            && self.url.trim() == Self::SERVER_DEFAULT_POSTGRES_URL
        {
            return Err(runtime_profile_error(
                "PostgreSQL configuration is incomplete; the runtime TOML still contains the default placeholder URL.",
                profile,
                location,
            ));
        }
        Ok(())
    }

    pub fn from_config_file(path: impl AsRef<Path>) -> Result<Option<Self>, String> {
        let path = path.as_ref();
        let content = std::fs::read_to_string(path)
            .map_err(|error| format!("failed to read {}: {error}", path.display()))?;
        Self::from_runtime_config_toml(&content).map(Some)
    }

    pub fn from_runtime_config_toml(content: &str) -> Result<Self, String> {
        let runtime_config: RuntimeConfigFile = toml::from_str(content)
            .map_err(|error| format!("invalid runtime config TOML: {error}"))?;
        let database = runtime_config.database;
        let max_connections = database
            .max_connections
            .unwrap_or(Self::DEFAULT_MAX_CONNECTIONS);

        let config = Self::from_url_with_max_connections(database.url, max_connections)?;
        if let Some(engine) = database.engine {
            let engine = engine.trim().to_ascii_lowercase();
            let expected = match config.engine {
                DatabaseEngine::Sqlite => "sqlite",
                DatabaseEngine::Postgres => "postgresql",
            };
            if engine != expected && !(engine == "postgres" && expected == "postgresql") {
                return Err(format!(
                    "runtime config [database].engine {engine} does not match database url scheme {expected}"
                ));
            }
        }
        Ok(config)
    }

    pub fn startup_help_lines(profile: RuntimeConfigProfile) -> Vec<String> {
        let location = RuntimeConfigLocation::for_current_platform(profile);
        Self::startup_help_lines_for_location(profile, &location)
    }

    pub fn startup_help_lines_for_location(
        profile: RuntimeConfigProfile,
        location: &RuntimeConfigLocation,
    ) -> Vec<String> {
        match profile {
            RuntimeConfigProfile::Server => vec![
                format!("Runtime config file: {}", location.config_file.display()),
                format!("Data directory: {}", location.data_directory.display()),
                "Set SDKWORK_CLAW_CONFIG_FILE to override the runtime TOML location.".to_owned(),
                "Server/service deployments default to local SQLite for quick single-node installs."
                    .to_owned(),
                format!(
                    "Default SQLite file: {}",
                    location.sqlite_database_path().display()
                ),
                format!(
                    "For production PostgreSQL, set SDKWORK_CLAW_DATABASE_URL or edit [database].url in {}",
                    location.config_file.display()
                ),
                format!(
                    "PostgreSQL DSN example: {}",
                    Self::SERVER_DEFAULT_POSTGRES_URL
                ),
            ],
            RuntimeConfigProfile::Desktop => vec![
                format!("Runtime config file: {}", location.config_file.display()),
                format!("Data directory: {}", location.data_directory.display()),
                "Set SDKWORK_CLAW_CONFIG_FILE to override the runtime TOML location.".to_owned(),
                "Desktop deployments default to SQLite.".to_owned(),
                format!(
                    "Default SQLite file: {}",
                    location.sqlite_database_path().display()
                ),
            ],
        }
    }

    pub fn startup_help_text(profile: RuntimeConfigProfile) -> String {
        Self::startup_help_lines(profile).join("\n")
    }
}

impl DatabaseEngine {
    fn from_url(url: &str) -> Result<Self, String> {
        let normalized = url.trim().to_ascii_lowercase();
        if normalized.is_empty() {
            return Err("database url must not be empty".to_owned());
        }
        if normalized.starts_with("sqlite:") {
            return Ok(Self::Sqlite);
        }
        if normalized.starts_with("postgres://") || normalized.starts_with("postgresql://") {
            return Ok(Self::Postgres);
        }
        Err(format!("unsupported database url scheme: {url}"))
    }
}

impl RuntimeConfigLocation {
    pub fn for_current_platform(profile: RuntimeConfigProfile) -> Self {
        let platform = if cfg!(windows) {
            "windows"
        } else if cfg!(target_os = "macos") {
            "macos"
        } else {
            "linux"
        };
        Self::for_platform_resolved(platform, profile, |key| std::env::var(key).ok())
    }

    pub fn for_platform(platform: &str, profile: RuntimeConfigProfile) -> Self {
        match (normalize_platform(platform).as_str(), profile) {
            ("windows", RuntimeConfigProfile::Server) => Self {
                config_file: PathBuf::from(
                    "%ProgramData%/SdkWork/Claw Router/sdkwork-claw-router.toml",
                ),
                data_directory: PathBuf::from("%ProgramData%/SdkWork/Claw Router/Data"),
            },
            ("windows", RuntimeConfigProfile::Desktop) => Self {
                config_file: PathBuf::from(
                    "%APPDATA%/SdkWork/Claw Router/sdkwork-claw-router.toml",
                ),
                data_directory: PathBuf::from("%LOCALAPPDATA%/SdkWork/Claw Router"),
            },
            ("macos", RuntimeConfigProfile::Server) => Self {
                config_file: PathBuf::from(
                    "/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml",
                ),
                data_directory: PathBuf::from("/Library/Application Support/SdkWork/Claw Router"),
            },
            ("macos", RuntimeConfigProfile::Desktop) => Self {
                config_file: PathBuf::from(
                    "~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml",
                ),
                data_directory: PathBuf::from("~/Library/Application Support/SdkWork/Claw Router"),
            },
            (_, RuntimeConfigProfile::Server) => Self {
                config_file: PathBuf::from("/etc/sdkwork-claw-router/sdkwork-claw-router.toml"),
                data_directory: PathBuf::from("/var/lib/sdkwork-claw-router"),
            },
            (_, RuntimeConfigProfile::Desktop) => Self {
                config_file: PathBuf::from(
                    "${XDG_CONFIG_HOME:-~/.config}/sdkwork-claw-router/sdkwork-claw-router.toml",
                ),
                data_directory: PathBuf::from(
                    "${XDG_DATA_HOME:-~/.local/share}/sdkwork-claw-router",
                ),
            },
        }
    }

    pub fn for_platform_resolved<F>(platform: &str, profile: RuntimeConfigProfile, env: F) -> Self
    where
        F: Fn(&str) -> Option<String>,
    {
        let get_env = |key: &str| env(key).filter(|value| !value.trim().is_empty());
        match (normalize_platform(platform).as_str(), profile) {
            ("windows", RuntimeConfigProfile::Server) => {
                let program_data = get_env("ProgramData")
                    .or_else(|| get_env("PROGRAMDATA"))
                    .unwrap_or_else(|| "C:/ProgramData".to_owned());
                let root = join_runtime_path(&program_data, "SdkWork/Claw Router");
                Self {
                    config_file: PathBuf::from(join_runtime_path(
                        &root,
                        "sdkwork-claw-router.toml",
                    )),
                    data_directory: PathBuf::from(join_runtime_path(&root, "Data")),
                }
            }
            ("windows", RuntimeConfigProfile::Desktop) => {
                let app_data = get_env("APPDATA")
                    .unwrap_or_else(|| "C:/Users/Default/AppData/Roaming".to_owned());
                let local_app_data = get_env("LOCALAPPDATA")
                    .unwrap_or_else(|| "C:/Users/Default/AppData/Local".to_owned());
                let config_root = join_runtime_path(&app_data, "SdkWork/Claw Router");
                let data_root = join_runtime_path(&local_app_data, "SdkWork/Claw Router");
                Self {
                    config_file: PathBuf::from(join_runtime_path(
                        &config_root,
                        "sdkwork-claw-router.toml",
                    )),
                    data_directory: PathBuf::from(data_root),
                }
            }
            ("macos", RuntimeConfigProfile::Server) => Self::for_platform(platform, profile),
            ("macos", RuntimeConfigProfile::Desktop) => {
                let home = get_env("HOME").unwrap_or_else(|| "~".to_owned());
                let root =
                    join_runtime_path(&home, "Library/Application Support/SdkWork/Claw Router");
                Self {
                    config_file: PathBuf::from(join_runtime_path(
                        &root,
                        "sdkwork-claw-router.toml",
                    )),
                    data_directory: PathBuf::from(root),
                }
            }
            (_, RuntimeConfigProfile::Server) => Self::for_platform(platform, profile),
            (_, RuntimeConfigProfile::Desktop) => {
                let home = get_env("HOME").unwrap_or_else(|| "~".to_owned());
                let config_home = get_env("XDG_CONFIG_HOME")
                    .unwrap_or_else(|| join_runtime_path(&home, ".config"));
                let data_home = get_env("XDG_DATA_HOME")
                    .unwrap_or_else(|| join_runtime_path(&home, ".local/share"));
                let config_root = join_runtime_path(&config_home, "sdkwork-claw-router");
                let data_root = join_runtime_path(&data_home, "sdkwork-claw-router");
                Self {
                    config_file: PathBuf::from(join_runtime_path(
                        &config_root,
                        "sdkwork-claw-router.toml",
                    )),
                    data_directory: PathBuf::from(data_root),
                }
            }
        }
    }

    pub fn sqlite_database_path(&self) -> PathBuf {
        PathBuf::from(join_runtime_path(
            self.data_directory.to_string_lossy().as_ref(),
            "sdkwork-claw-router.sqlite",
        ))
    }
}

fn explicit_runtime_config_file() -> Option<PathBuf> {
    std::env::var(DatabaseConfig::ENV_CONFIG_FILE)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
        .map(PathBuf::from)
}

fn runtime_config_profile_from_env() -> RuntimeConfigProfile {
    match std::env::var("SDKWORK_CLAW_DEPLOYMENT_MODE")
        .unwrap_or_default()
        .trim()
        .to_ascii_lowercase()
        .as_str()
    {
        "desktop" => RuntimeConfigProfile::Desktop,
        _ => RuntimeConfigProfile::Server,
    }
}

fn normalize_platform(platform: &str) -> String {
    match platform.trim().to_ascii_lowercase().as_str() {
        "win32" | "windows" => "windows".to_owned(),
        "darwin" | "mac" | "macos" => "macos".to_owned(),
        _ => "linux".to_owned(),
    }
}

fn join_runtime_path(base: &str, child: &str) -> String {
    let base = base.trim().trim_end_matches(['/', '\\']);
    let child = child.trim().trim_start_matches(['/', '\\']);
    if base.is_empty() {
        return child.to_owned();
    }
    if child.is_empty() {
        return base.to_owned();
    }
    format!("{base}/{child}")
}

fn portable_path(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}

fn toml_string(value: &str) -> String {
    value
        .replace('\\', "\\\\")
        .replace('"', "\\\"")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
}

fn runtime_profile_error(
    message: &str,
    profile: RuntimeConfigProfile,
    location: &RuntimeConfigLocation,
) -> String {
    format!(
        "{message}\nRuntime TOML: {}\n{}",
        location.config_file.display(),
        DatabaseConfig::startup_help_lines_for_location(profile, location).join("\n")
    )
}
