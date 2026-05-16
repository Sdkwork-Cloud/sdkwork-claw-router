use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppRoutingReadStore;
use sdkwork_claw_product::ports::{AppRoutingReadStore, AppRoutingSubject};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;

#[tokio::test]
async fn sqlite_routing_usage_ignores_missing_latency_when_averaging() {
    let pool = sqlite_pool().await;
    create_routing_usage_tables(&pool).await;
    insert_trace(&pool, "req-1", Some(100), "2026-05-03 10:00:00").await;
    insert_trace(&pool, "req-2", None, "2026-05-03 10:05:00").await;

    let store = SqliteAppRoutingReadStore::new(pool);
    let snapshot = store
        .load_routing_usage(Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(1, snapshot.chart_data.len());
    assert_eq!("2026-05-03", snapshot.chart_data[0].time);
    assert_eq!(2, snapshot.chart_data[0].requests);
    assert_eq!(100, snapshot.chart_data[0].latency);

    assert_eq!(1, snapshot.model_stats.len());
    assert_eq!("openai/global/gpt-4o-mini", snapshot.model_stats[0].m);
    assert_eq!("2", snapshot.model_stats[0].req);
    assert_eq!("100.0%", snapshot.model_stats[0].sr);
    assert_eq!("100ms", snapshot.model_stats[0].lat);
}

#[tokio::test]
async fn sqlite_routing_channels_include_rfc3339_effective_channel_models() {
    let pool = sqlite_pool().await;
    create_routing_channel_tables(&pool).await;
    seed_routing_channel(&pool).await;
    sqlx::query(
        r#"
        UPDATE integration_channel_model
        SET effective_from = strftime('%Y-%m-%dT00:00:00Z', 'now')
        WHERE id = 3001
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let store = SqliteAppRoutingReadStore::new(pool);
    let channels = store
        .load_routing_channels(Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(1, channels.len());
    assert_eq!(
        vec!["openai/global/gpt-4o-mini".to_owned()],
        channels[0].models
    );
    assert_eq!("active", channels[0].status);
    assert_eq!(Some(60_000), channels[0].timeout_ms);
    let retry_policy = channels[0]
        .retry_policy
        .as_ref()
        .expect("retry policy should be projected from integration_channel");
    assert_eq!(3, retry_policy.max_attempts);
    assert_eq!(vec![429, 503], retry_policy.retryable_status_codes);
    assert_eq!(25, retry_policy.backoff_ms);
}

#[tokio::test]
async fn sqlite_routing_request_traces_expose_safe_audit_metadata_without_payloads() {
    let pool = sqlite_pool().await;
    create_routing_usage_tables(&pool).await;
    insert_trace(&pool, "req-safe-audit", Some(345), "2026-05-03 10:00:00").await;
    sqlx::query(
        r#"
        UPDATE ai_request_trace
        SET trace_id = 'trace-safe-audit',
            request_path = '/v1/chat/completions',
            http_method = 'POST',
            request_payload_hash = 'sha256:req',
            response_payload_hash = 'sha256:res',
            request_bytes = 512,
            response_bytes = 4096,
            error_message_masked = 'provider timeout',
            streaming = 1,
            ended_at = '2026-05-03 10:00:00.345'
        WHERE request_id = 'req-safe-audit'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    let store = SqliteAppRoutingReadStore::new(pool);
    let traces = store
        .load_routing_request_traces(Some(owner_subject()))
        .await
        .unwrap();

    assert_eq!(1, traces.len());
    assert_eq!("trace-safe-audit", traces[0].trace_id);
    assert_eq!("req-safe-audit", traces[0].request_id);
    assert_eq!("/v1/chat/completions", traces[0].request_path);
    assert_eq!("POST", traces[0].http_method);
    assert_eq!("sha256:req", traces[0].request_payload_hash);
    assert_eq!("sha256:res", traces[0].response_payload_hash);
    assert_eq!(512, traces[0].request_bytes);
    assert_eq!(4096, traces[0].response_bytes);
    assert_eq!("provider timeout", traces[0].error_message_masked);
    assert!(traces[0].streaming);
    assert_eq!("2026-05-03 10:00:00", traces[0].started_at);
    assert_eq!("2026-05-03 10:00:00.345", traces[0].ended_at);
}

async fn sqlite_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

fn owner_subject() -> AppRoutingSubject {
    AppRoutingSubject {
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
    }
}

async fn create_routing_usage_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE ai_request_trace (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            trace_id TEXT,
            status INTEGER NOT NULL,
            created_at TEXT,
            started_at TEXT,
            ended_at TEXT,
            channel_name_snapshot TEXT,
            requested_model TEXT,
            provider_model TEXT,
            request_path TEXT,
            http_method TEXT,
            http_status INTEGER,
            error_type INTEGER,
            provider_error_code TEXT,
            error_message_masked TEXT,
            request_payload_hash TEXT,
            response_payload_hash TEXT,
            request_bytes INTEGER,
            response_bytes INTEGER,
            streaming INTEGER,
            latency_ms INTEGER,
            total_tokens INTEGER
        )
        "#,
        r#"
        CREATE TABLE ai_routing_decision_log (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            status INTEGER NOT NULL,
            resolved_model TEXT,
            selected_channel_id INTEGER
        )
        "#,
        r#"
        CREATE TABLE ai_usage_fact (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            catalog_key TEXT NOT NULL,
            model TEXT,
            total_tokens INTEGER
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn create_routing_channel_tables(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE integration_channel (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            name TEXT,
            channel_code TEXT,
            provider_code TEXT,
            protocol INTEGER NOT NULL,
            access_type INTEGER NOT NULL,
            base_url_override TEXT,
            capabilities TEXT,
            timeout_ms INTEGER,
            retry_policy TEXT,
            weight INTEGER,
            status INTEGER NOT NULL,
            health_status INTEGER NOT NULL,
            last_latency_ms INTEGER,
            rpm_limit INTEGER,
            upstream_balance_amount TEXT,
            upstream_balance_currency TEXT,
            consecutive_error_count INTEGER,
            account_id INTEGER,
            priority INTEGER NOT NULL,
            deleted_at TEXT
        )
        "#,
        r#"
        CREATE TABLE integration_provider_account (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            masked_label TEXT,
            upstream_balance_amount TEXT,
            upstream_balance_currency TEXT,
            consecutive_error_count INTEGER,
            deleted_at TEXT
        )
        "#,
        r#"
        CREATE TABLE integration_channel_model (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            channel_id INTEGER NOT NULL,
            catalog_key TEXT NOT NULL,
            model TEXT NOT NULL,
            status INTEGER NOT NULL,
            effective_from TEXT,
            effective_to TEXT,
            deleted_at TEXT
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_routing_channel(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO integration_provider_account (
            id, tenant_id, organization_id, masked_label, consecutive_error_count
        )
        VALUES (9001, 10, 20, 'sk-***test', 0)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_channel (
            id, tenant_id, organization_id, name, provider_code, protocol, access_type,
            base_url_override, capabilities, timeout_ms, retry_policy, weight, status, health_status, last_latency_ms,
            rpm_limit, consecutive_error_count, account_id, priority
        )
        VALUES (
            2001, 10, 20, 'OpenAI primary', 'openai', 1, 1,
            'https://api.openai.test/v1', '["llm"]', 60000,
            '{"max_attempts":3,"retryable_status_codes":[429,503],"backoff_ms":25}',
            100, 1, 1, 120,
            600, 0, 9001, 1
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO integration_channel_model (
            id, tenant_id, organization_id, channel_id, catalog_key, model, status
        )
        VALUES (3001, 10, 20, 2001, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 1)
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_trace(
    pool: &SqlitePool,
    request_id: &str,
    latency_ms: Option<i64>,
    started_at: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_request_trace (
            tenant_id, organization_id, user_id, request_id, status, created_at, started_at,
            channel_name_snapshot, requested_model, provider_model, http_status, error_type, provider_error_code,
            latency_ms, total_tokens
        )
        VALUES (10, 20, 30, ?, 1, ?, ?, 'OpenAI primary', 'openai/global/gpt-4o-mini', '', 200, NULL, NULL, ?, 9)
        "#,
    )
    .bind(request_id)
    .bind(started_at)
    .bind(started_at)
    .bind(latency_ms)
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO ai_usage_fact (
            tenant_id, organization_id, user_id, status, request_id, catalog_key, model, total_tokens
        )
        VALUES (10, 20, 30, 1, ?, 'openai/global/gpt-4o-mini', 'gpt-4o-mini', 9)
        "#,
    )
    .bind(request_id)
    .execute(pool)
    .await
    .unwrap();
}
