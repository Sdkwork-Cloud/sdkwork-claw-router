use std::time::Duration;

use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

pub const POSTGRES_POOL_ACQUIRE_TIMEOUT_SECONDS: u64 = 10;

pub fn postgres_runtime_pool_options(max_connections: u32) -> PgPoolOptions {
    PgPoolOptions::new()
        .max_connections(max_connections)
        .acquire_timeout(Duration::from_secs(POSTGRES_POOL_ACQUIRE_TIMEOUT_SECONDS))
}

pub async fn connect_postgres_runtime_pool(
    database_url: &str,
    max_connections: u32,
) -> Result<PgPool, sqlx::Error> {
    postgres_runtime_pool_options(max_connections)
        .connect(database_url)
        .await
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
