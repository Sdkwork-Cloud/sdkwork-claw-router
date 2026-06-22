use std::time::Duration;

use sdkwork_database_config::{
    DatabaseConfig as StandardDatabaseConfig, DatabaseEngine as StandardDatabaseEngine,
};
use sdkwork_database_repository::RepositoryError;
use sdkwork_database_sqlx::{DatabasePool, PoolBuilder, PoolError};
use sqlx::PgPool;

use super::runtime_id::to_standard_database_config;

pub const POSTGRES_POOL_ACQUIRE_TIMEOUT_SECONDS: u64 = 10;
pub const SQLITE_POOL_ACQUIRE_TIMEOUT_SECONDS: u64 = 10;
pub const SQLITE_BUSY_TIMEOUT_SECONDS: u64 = 30;
pub const SQLITE_RUNTIME_MIN_POOL_CONNECTIONS: u32 =
    sdkwork_claw_config::DatabaseConfig::DESKTOP_SQLITE_DEFAULT_MAX_CONNECTIONS;

fn postgres_standard_config(database_url: &str, max_connections: u32) -> StandardDatabaseConfig {
    StandardDatabaseConfig {
        engine: StandardDatabaseEngine::Postgres,
        url: database_url.to_owned(),
        max_connections,
        ..StandardDatabaseConfig::default()
    }
}

fn pool_error_to_sqlx(error: PoolError) -> sqlx::Error {
    sqlx::Error::Configuration(error.to_string().into())
}

pub fn is_sqlite_in_memory_database_url(database_url: &str) -> bool {
    let lower = database_url.to_ascii_lowercase();
    lower == "sqlite::memory:" || lower.contains(":memory:") || lower.contains("mode=memory")
}

pub fn effective_sqlite_runtime_pool_max_connections(database_url: &str, configured: u32) -> u32 {
    if is_sqlite_in_memory_database_url(database_url) {
        return configured;
    }
    configured.max(SQLITE_RUNTIME_MIN_POOL_CONNECTIONS)
}

pub async fn connect_standard_database_pool(
    config: &sdkwork_claw_config::DatabaseConfig,
) -> Result<DatabasePool, RepositoryError> {
    let mut standard = to_standard_database_config(config);
    if matches!(standard.engine, StandardDatabaseEngine::Sqlite) {
        standard.max_connections =
            effective_sqlite_runtime_pool_max_connections(&config.url, config.max_connections);
    }
    PoolBuilder::new(standard)
        .acquire_timeout(Duration::from_secs(
            if matches!(config.engine, sdkwork_claw_config::DatabaseEngine::Sqlite) {
                SQLITE_POOL_ACQUIRE_TIMEOUT_SECONDS
            } else {
                POSTGRES_POOL_ACQUIRE_TIMEOUT_SECONDS
            },
        ))
        .build()
        .await
        .map_err(RepositoryError::from)
}

pub async fn connect_claw_sqlite_runtime_database_pool(
    config: &sdkwork_claw_config::DatabaseConfig,
) -> Result<DatabasePool, RepositoryError> {
    connect_standard_database_pool(config).await
}

pub async fn connect_claw_sqlite_runtime_pool(
    config: &sdkwork_claw_config::DatabaseConfig,
) -> Result<sqlx::SqlitePool, RepositoryError> {
    connect_claw_sqlite_runtime_database_pool(config)
        .await?
        .as_sqlite()
        .cloned()
        .ok_or_else(|| RepositoryError::Generic("expected sqlite database pool".into()))
}

pub async fn connect_postgres_runtime_pool(
    database_url: &str,
    max_connections: u32,
) -> Result<PgPool, sqlx::Error> {
    let pool = PoolBuilder::new(postgres_standard_config(database_url, max_connections))
        .acquire_timeout(Duration::from_secs(POSTGRES_POOL_ACQUIRE_TIMEOUT_SECONDS))
        .build()
        .await
        .map_err(pool_error_to_sqlx)?;
    pool.as_postgres()
        .cloned()
        .ok_or_else(|| sqlx::Error::Configuration("expected postgres database pool".into()))
}

pub fn sqlite_database_readiness_check(
    pool: sqlx::SqlitePool,
) -> sdkwork_claw_http::ReadinessCheckFn {
    std::sync::Arc::new(move || {
        let pool = pool.clone();
        Box::pin(async move { sqlx::query("SELECT 1").execute(&pool).await.is_ok() })
    })
}

pub fn postgres_database_readiness_check(pool: PgPool) -> sdkwork_claw_http::ReadinessCheckFn {
    std::sync::Arc::new(move || {
        let pool = pool.clone();
        Box::pin(async move { sqlx::query("SELECT 1").execute(&pool).await.is_ok() })
    })
}

pub fn standard_database_readiness_check(
    pool: DatabasePool,
) -> sdkwork_claw_http::ReadinessCheckFn {
    match pool {
        DatabasePool::Sqlite(sqlite_pool, _) => sqlite_database_readiness_check(sqlite_pool),
        DatabasePool::Postgres(postgres_pool, _) => {
            postgres_database_readiness_check(postgres_pool)
        }
    }
}
