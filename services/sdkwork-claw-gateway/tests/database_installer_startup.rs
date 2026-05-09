use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use sdkwork_claw_config::{ApiKeySecurityConfig, DatabaseConfig};
use sdkwork_claw_gateway::runtime::router_with_database_and_api_key_config;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::Row;
use std::str::FromStr;

static DB_COUNTER: AtomicU64 = AtomicU64::new(0);

#[tokio::test]
async fn gateway_startup_installs_empty_sqlite_database_before_loading_catalog() {
    let database_url = unique_sqlite_url();
    let config = DatabaseConfig::from_url_with_max_connections(database_url.as_str(), 1).unwrap();
    let api_key_config =
        ApiKeySecurityConfig::from_pepper_secret("0123456789abcdef0123456789abcdef").unwrap();

    let _router = router_with_database_and_api_key_config(config, Some(api_key_config))
        .await
        .unwrap();

    let options = SqliteConnectOptions::from_str(database_url.as_str())
        .unwrap()
        .create_if_missing(false);
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(options)
        .await
        .unwrap();

    let state =
        sqlx::query("SELECT status, schema_version, catalog_version FROM system_installation_state WHERE id = 1")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!("installed", state.get::<String, _>("status"));
    assert_eq!("2026.05.07.3", state.get::<String, _>("schema_version"));
    assert_eq!("2026.05.08.1", state.get::<String, _>("catalog_version"));

    let gpt_5_5_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE model = 'gpt-5.5'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(1, gpt_5_5_count);

    let gpt_5_4_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE model = 'gpt-5.4'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(1, gpt_5_4_count);

    let gpt_image_2_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM ai_model WHERE model = 'gpt-image-2'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(1, gpt_image_2_count);

    let deprecated_gpt_5_2_routing_state: i64 =
        sqlx::query_scalar("SELECT routing_state FROM ai_model WHERE model = 'gpt-5.2'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, deprecated_gpt_5_2_routing_state);

    let ranking_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM ai_model_rank_snapshot WHERE rank_scope = 'commercial-default'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(
        ranking_count >= 9,
        "gateway startup installer must seed model rankings"
    );
}

fn unique_sqlite_url() -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    let counter = DB_COUNTER.fetch_add(1, Ordering::Relaxed);
    let mut path = std::env::temp_dir();
    path.push(format!(
        "sdkwork-claw-gateway-startup-{millis}-{counter}.sqlite"
    ));
    format!("sqlite://{}", path.to_string_lossy().replace('\\', "/"))
}
