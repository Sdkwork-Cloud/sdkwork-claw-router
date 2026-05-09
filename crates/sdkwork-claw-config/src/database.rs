use serde::{Deserialize, Serialize};

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

impl DatabaseConfig {
    pub const DEFAULT_MAX_CONNECTIONS: u32 = 16;

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
        Self::from_optional_parts(
            std::env::var("SDKWORK_CLAW_DATABASE_URL").ok(),
            std::env::var("SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS").ok(),
        )
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
