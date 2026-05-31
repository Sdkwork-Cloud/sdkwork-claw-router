use std::env;
use std::time::{SystemTime, UNIX_EPOCH};

use sdkwork_claw_product::infrastructure::sql::postgres::{
    PostgresAppGenerationHistoryReadStore, PostgresGatewayUsageRecorder,
    PostgresPaymentCallbackStore,
};
use sdkwork_claw_product::ports::{
    AppGenerationHistoryReadStore, AppGenerationHistorySubject, GatewayUsageRecordCommand,
    GatewayUsageRecorder, PaymentCallbackCommand, PaymentCallbackStatus, PaymentCallbackStore,
};
use sqlx::postgres::PgPoolOptions;
use sqlx::{PgPool, Row};

const POSTGRES_TEST_DATABASE_URL: &str = "SDKWORK_CLAW_POSTGRES_TEST_DATABASE_URL";

#[tokio::test]
async fn postgres_payment_callback_concurrent_first_account_creation_credits_one_account() {
    let Some(ctx) = PostgresTestContext::new("payment_callback").await else {
        return;
    };
    seed_pending_recharge_payment(&ctx.pool, "pg-order-1", "10.00", 100).await;
    seed_pending_recharge_payment(&ctx.pool, "pg-order-2", "20.00", 200).await;

    let store_a = PostgresPaymentCallbackStore::new(ctx.pool.clone());
    let store_b = store_a.clone();
    let first = async move {
        store_a
            .process_payment_callback(success_command(
                "pg-evt-1",
                "pg-nonce-1",
                "pg-order-1",
                "pg-txn-1",
                Some("10.00"),
            ))
            .await
    };
    let second = async move {
        store_b
            .process_payment_callback(success_command(
                "pg-evt-2",
                "pg-nonce-2",
                "pg-order-2",
                "pg-txn-2",
                Some("20.00"),
            ))
            .await
    };

    let (first, second) = tokio::join!(first, second);
    let first = first.unwrap();
    let second = second.unwrap();
    let mut balances = [first.balance, second.balance];
    balances.sort();

    assert_eq!([100, 300], balances);
    assert_eq!(300, first.credited_points + second.credited_points);
    assert_eq!(
        1,
        scalar_i64(
            &ctx.pool,
            "SELECT COUNT(1) FROM commerce_account WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '30' AND asset_type = 'points' AND currency_code = 'POINT'"
        )
        .await
    );
    assert_eq!(
        300,
        scalar_i64(
            &ctx.pool,
            "SELECT available_amount::bigint FROM commerce_account WHERE tenant_id = '10' AND organization_id = '20' AND owner_user_id = '30' AND asset_type = 'points' AND currency_code = 'POINT'"
        )
        .await
    );
    assert_eq!(
        2,
        scalar_i64(
            &ctx.pool,
            "SELECT COUNT(1) FROM commerce_account_ledger_entry WHERE business_type = 'recharge' AND direction = 'credit'"
        )
        .await
    );
    assert_eq!(
        2,
        scalar_i64(
            &ctx.pool,
            "SELECT COUNT(1) FROM commerce_payment_attempt WHERE status = 'succeeded'"
        )
        .await
    );
    assert_eq!(
        2,
        scalar_i64(
            &ctx.pool,
            "SELECT COUNT(1) FROM commerce_payment_intent WHERE status = 'succeeded'"
        )
        .await
    );
    assert_eq!(
        2,
        scalar_i64(
            &ctx.pool,
            "SELECT COUNT(1) FROM commerce_order WHERE status = 'paid'"
        )
        .await
    );

    ctx.cleanup().await;
}

#[tokio::test]
async fn postgres_gateway_usage_recorder_preserves_non_pending_usage_fact_on_duplicate_request_id()
{
    let Some(ctx) = PostgresTestContext::new("gateway_usage_recorder").await else {
        return;
    };
    let recorder = PostgresGatewayUsageRecorder::new(ctx.pool.clone());
    let mut command = usage_command("pg-usage-settlement-failed", 200);
    recorder
        .record_gateway_usage(command.clone())
        .await
        .unwrap();
    sqlx::query(
        r#"
        UPDATE ai_usage_fact
        SET settlement_status = 3,
            customer_charge_amount = 7.722000,
            cost_amount = 4.290000,
            total_tokens = 18
        WHERE request_id = 'pg-usage-settlement-failed'
        "#,
    )
    .execute(&ctx.pool)
    .await
    .unwrap();

    command.prompt_tokens = 999;
    command.completion_tokens = 888;
    command.cached_tokens = 0;
    command.total_tokens = 1887;
    command.customer_charge_amount = "1999.000000".to_owned();
    command.upstream_cost_amount = "1555.000000".to_owned();
    recorder.record_gateway_usage(command).await.unwrap();

    let usage = sqlx::query(
        r#"
        SELECT total_tokens,
               customer_charge_amount::text AS customer_charge_amount,
               cost_amount::text AS cost_amount,
               settlement_status
        FROM ai_usage_fact
        WHERE request_id = 'pg-usage-settlement-failed'
        "#,
    )
    .fetch_one(&ctx.pool)
    .await
    .unwrap();
    assert_eq!(18_i64, usage.get::<i64, _>("total_tokens"));
    assert_eq!("7.722000", usage.get::<String, _>("customer_charge_amount"));
    assert_eq!("4.290000", usage.get::<String, _>("cost_amount"));
    assert_eq!(
        3_i64,
        usage.get::<i64, _>("settlement_status"),
        "Postgres gateway usage recorder must freeze non-pending usage facts"
    );

    let trace = sqlx::query(
        r#"
        SELECT total_tokens, http_status
        FROM ai_request_trace
        WHERE request_id = 'pg-usage-settlement-failed'
        "#,
    )
    .fetch_one(&ctx.pool)
    .await
    .unwrap();
    assert_eq!(
        18_i64,
        trace.get::<i64, _>("total_tokens"),
        "Postgres gateway usage recorder must freeze trace rows once usage settlement starts"
    );
    assert_eq!(200_i32, trace.get::<i32, _>("http_status"));

    ctx.cleanup().await;
}

#[tokio::test]
async fn postgres_generation_history_loads_visible_statuses_without_sensitive_fields() {
    let Some(ctx) = PostgresTestContext::new("generation_history").await else {
        return;
    };
    seed_mixed_generation_history(&ctx.pool).await;

    let store = PostgresAppGenerationHistoryReadStore::new(ctx.pool.clone());
    let items = store
        .load_generation_history(Some(AppGenerationHistorySubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
        }))
        .await
        .unwrap();

    let ids: Vec<&str> = items.iter().map(|item| item.id.as_str()).collect();
    assert_eq!(vec!["401", "301", "201", "102", "101"], ids);

    let statuses: Vec<&str> = items
        .iter()
        .map(|item| item.status.as_deref().unwrap())
        .collect();
    assert_eq!(
        vec!["pending", "cancelled", "failed", "processing", "completed"],
        statuses
    );

    assert_eq!("sfx", items[0].item_type);
    assert_eq!("music", items[1].item_type);
    assert_eq!("audio", items[2].item_type);
    assert_eq!("video", items[3].item_type);
    assert_eq!(
        "https://cdn.example.test/video-102.mp4",
        items[3].videos[0].url
    );
    assert_eq!(
        Some("https://cdn.example.test/video-102.jpg"),
        items[3].videos[0].thumb.as_deref()
    );
    assert_eq!("image", items[4].item_type);
    assert_eq!(
        vec!["https://cdn.example.test/image-101.png".to_owned()],
        items[4].images
    );

    let payload = serde_json::to_string(&items).unwrap();
    for internal_value in [
        "storage://internal/image-101",
        "payload-hash-101",
        "trace-secret-201",
        "ip-hash-201",
        "ua-hash-201",
        "provider raw error",
    ] {
        assert!(
            !payload.contains(internal_value),
            "Postgres generation history DTO must not expose internal field value: {internal_value}"
        );
    }

    ctx.cleanup().await;
}

#[tokio::test]
async fn postgres_generation_history_orders_newest_first_and_limits_to_100() {
    let Some(ctx) = PostgresTestContext::new("generation_history_limit").await else {
        return;
    };
    for id in 1..=105_i64 {
        insert_generation_job(
            &ctx.pool,
            id,
            10,
            20,
            30,
            &format!("2026-05-03 12:00:00.{id:03}"),
            None,
            "batch history item",
            2,
            0,
            "image-pro",
            1,
        )
        .await;
    }

    let store = PostgresAppGenerationHistoryReadStore::new(ctx.pool.clone());
    let items = store
        .load_generation_history(Some(AppGenerationHistorySubject {
            tenant_id: 10,
            organization_id: 20,
            user_id: 30,
        }))
        .await
        .unwrap();

    assert_eq!(100, items.len());
    assert_eq!("105", items[0].id);
    assert_eq!("6", items[99].id);

    ctx.cleanup().await;
}

struct PostgresTestContext {
    pool: PgPool,
    database_url: String,
    schema: String,
}

impl PostgresTestContext {
    async fn new(label: &str) -> Option<Self> {
        let database_url = match env::var(POSTGRES_TEST_DATABASE_URL) {
            Ok(value) if !value.trim().is_empty() => value,
            _ => {
                eprintln!(
                    "skipping Postgres transaction integration test; set {POSTGRES_TEST_DATABASE_URL} to run it"
                );
                return None;
            }
        };
        let schema = unique_schema_name(label);
        let quoted_schema = quote_identifier(&schema);
        let admin_pool = PgPoolOptions::new()
            .max_connections(1)
            .connect(&database_url)
            .await
            .unwrap();
        sqlx::query(&format!("DROP SCHEMA IF EXISTS {quoted_schema} CASCADE"))
            .execute(&admin_pool)
            .await
            .unwrap();
        sqlx::query(&format!("CREATE SCHEMA {quoted_schema}"))
            .execute(&admin_pool)
            .await
            .unwrap();
        admin_pool.close().await;

        let schema_for_connections = schema.clone();
        let pool = PgPoolOptions::new()
            .max_connections(4)
            .after_connect(move |connection, _metadata| {
                let schema = schema_for_connections.clone();
                Box::pin(async move {
                    sqlx::query(&format!("SET search_path TO {}", quote_identifier(&schema)))
                        .execute(&mut *connection)
                        .await?;
                    Ok(())
                })
            })
            .connect(&database_url)
            .await
            .unwrap();
        create_schema(&pool).await;

        Some(Self {
            pool,
            database_url,
            schema,
        })
    }

    async fn cleanup(self) {
        let Self {
            pool,
            database_url,
            schema,
        } = self;
        pool.close().await;
        let admin_pool = PgPoolOptions::new()
            .max_connections(1)
            .connect(&database_url)
            .await
            .unwrap();
        sqlx::query(&format!(
            "DROP SCHEMA IF EXISTS {} CASCADE",
            quote_identifier(&schema)
        ))
        .execute(&admin_pool)
        .await
        .unwrap();
        admin_pool.close().await;
    }
}

async fn create_schema(pool: &PgPool) {
    for statement in [
        r#"CREATE TABLE commerce_payment_webhook_event (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            provider TEXT NOT NULL,
            event_id TEXT NOT NULL,
            nonce TEXT NOT NULL,
            signature TEXT,
            request_timestamp BIGINT,
            out_trade_no TEXT NOT NULL,
            transaction_id TEXT,
            payload_digest TEXT NOT NULL,
            status TEXT NOT NULL,
            message TEXT,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL,
            processed_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ NOT NULL,
            CONSTRAINT uk_commerce_payment_webhook_provider_event UNIQUE (tenant_id, provider, event_id),
            CONSTRAINT uk_commerce_payment_webhook_provider_nonce UNIQUE (tenant_id, provider, nonce)
        )"#,
        r#"CREATE TABLE commerce_account (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            owner_user_id TEXT NOT NULL,
            asset_type TEXT NOT NULL,
            currency_code TEXT,
            available_amount TEXT NOT NULL DEFAULT '0',
            frozen_amount TEXT NOT NULL DEFAULT '0',
            version INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, organization_id, owner_user_id, asset_type, currency_code)
        )"#,
        r#"CREATE TABLE commerce_account_ledger_entry (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            account_id TEXT NOT NULL,
            owner_user_id TEXT NOT NULL,
            asset_type TEXT NOT NULL,
            direction TEXT NOT NULL,
            amount TEXT NOT NULL,
            balance_after TEXT NOT NULL,
            business_type TEXT NOT NULL,
            transaction_no TEXT NOT NULL,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            source_type TEXT,
            source_id TEXT,
            remark TEXT,
            created_at TEXT NOT NULL,
            UNIQUE (tenant_id, transaction_no)
        )"#,
        r#"CREATE TABLE commerce_order (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            owner_user_id TEXT NOT NULL,
            order_no TEXT NOT NULL,
            status TEXT NOT NULL,
            subject TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            created_at TEXT NOT NULL,
            paid_at TEXT,
            cancelled_at TEXT,
            expired_at TEXT,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, order_no)
        )"#,
        r#"CREATE TABLE commerce_payment_intent (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            owner_user_id TEXT NOT NULL,
            order_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            amount TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            status TEXT NOT NULL,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )"#,
        r#"CREATE TABLE commerce_payment_attempt (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            owner_user_id TEXT NOT NULL,
            payment_intent_id TEXT NOT NULL,
            order_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            out_trade_no TEXT NOT NULL,
            amount TEXT NOT NULL,
            currency_code TEXT NOT NULL,
            status TEXT NOT NULL,
            callback_payload TEXT,
            created_at TEXT NOT NULL,
            paid_at TEXT,
            updated_at TEXT NOT NULL,
            UNIQUE (tenant_id, provider, out_trade_no)
        )"#,
        r#"CREATE TABLE ai_request_trace (
            id BIGSERIAL PRIMARY KEY,
            uuid VARCHAR(64) NOT NULL,
            tenant_id BIGINT,
            organization_id BIGINT,
            user_id BIGINT,
            request_id VARCHAR(128),
            trace_id VARCHAR(128),
            payload_hash VARCHAR(128),
            status INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            retention_until TIMESTAMPTZ,
            legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
            metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
            attempt_no INTEGER,
            decision_log_id BIGINT,
            api_key_id BIGINT,
            legacy_api_key_id BIGINT,
            api_key_name_snapshot VARCHAR(128),
            channel_group_id BIGINT,
            channel_group_snapshot VARCHAR(128),
            owner_type INTEGER,
            owner_id BIGINT,
            owner_name_snapshot VARCHAR(128),
            provider_id BIGINT,
            channel_id BIGINT,
            channel_name_snapshot VARCHAR(128),
            provider_account_id BIGINT,
            requested_model VARCHAR(128),
            requested_model_catalog_key VARCHAR(256),
            provider_model VARCHAR(128),
            provider_native_model VARCHAR(256),
            endpoint VARCHAR(256),
            request_path VARCHAR(256),
            http_method VARCHAR(16),
            http_status INTEGER,
            provider_error_code VARCHAR(128),
            error_type INTEGER,
            started_at TIMESTAMPTZ,
            ended_at TIMESTAMPTZ,
            latency_ms INTEGER,
            ttft_ms INTEGER,
            streaming BOOLEAN,
            request_bytes BIGINT,
            response_bytes BIGINT,
            prompt_tokens BIGINT,
            completion_tokens BIGINT,
            cached_tokens BIGINT,
            total_tokens BIGINT,
            request_payload_hash VARCHAR(128),
            response_payload_hash VARCHAR(128),
            error_message_masked VARCHAR(1024),
            reasoning_effort VARCHAR(64),
            client_ip_hash VARCHAR(128),
            client_ip_masked VARCHAR(64),
            client_ip_region VARCHAR(128),
            user_agent_hash VARCHAR(128),
            CONSTRAINT uk_ai_request_trace_request_attempt UNIQUE (tenant_id, organization_id, request_id, attempt_no)
        )"#,
        r#"CREATE TABLE ai_usage_fact (
            id BIGSERIAL PRIMARY KEY,
            uuid VARCHAR(64) NOT NULL,
            tenant_id BIGINT,
            organization_id BIGINT,
            user_id BIGINT,
            request_id VARCHAR(128),
            trace_id VARCHAR(128),
            payload_hash VARCHAR(128),
            status INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            retention_until TIMESTAMPTZ,
            legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
            metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
            decision_log_id BIGINT,
            api_key_id BIGINT,
            legacy_api_key_id BIGINT,
            api_key_name_snapshot VARCHAR(128),
            channel_group_id BIGINT,
            channel_group_snapshot VARCHAR(128),
            owner_type INTEGER,
            owner_id BIGINT,
            owner_name_snapshot VARCHAR(128),
            catalog_key VARCHAR(256) NOT NULL,
            requested_model_catalog_key VARCHAR(256),
            model VARCHAR(128),
            provider_native_model VARCHAR(256),
            provider_id BIGINT,
            channel_id BIGINT,
            provider_account_id BIGINT,
            modality INTEGER,
            usage_type INTEGER,
            billing_type INTEGER,
            billing_mode INTEGER,
            billing_meter_id BIGINT,
            billing_meter_code VARCHAR(64),
            billing_tier VARCHAR(64),
            billable_quantity NUMERIC(38, 12),
            billable_unit INTEGER,
            prompt_tokens BIGINT,
            completion_tokens BIGINT,
            cached_tokens BIGINT,
            total_tokens BIGINT,
            request_count BIGINT,
            result_count BIGINT,
            item_count BIGINT,
            character_count BIGINT,
            image_count BIGINT,
            audio_seconds NUMERIC(38, 12),
            video_seconds NUMERIC(38, 12),
            storage_byte_hours NUMERIC(38, 12),
            bandwidth_bytes BIGINT,
            unit_price_snapshot NUMERIC(38, 12),
            base_input_unit_price NUMERIC(38, 12),
            base_output_unit_price NUMERIC(38, 12),
            cache_read_unit_price NUMERIC(38, 12),
            rate_multiplier NUMERIC(38, 12),
            reference_multiplier NUMERIC(38, 12),
            official_reference_amount NUMERIC(38, 12),
            upstream_cost_amount NUMERIC(38, 12),
            customer_charge_amount NUMERIC(38, 12),
            cost_amount NUMERIC(38, 12),
            currency VARCHAR(10),
            pricing_id BIGINT,
            pricing_plan_id BIGINT,
            pricing_plan_code VARCHAR(64),
            pricing_rule_id BIGINT,
            pricing_tier_id BIGINT,
            pricing_snapshot JSONB,
            reasoning_effort VARCHAR(64),
            occurred_at TIMESTAMPTZ,
            settlement_status INTEGER,
            settlement_id BIGINT,
            CONSTRAINT uk_ai_usage_fact_request_type UNIQUE (tenant_id, organization_id, request_id, usage_type)
        )"#,
        r#"CREATE TABLE ai_generation_asset (
            id BIGINT PRIMARY KEY,
            tenant_id BIGINT NOT NULL,
            organization_id BIGINT NOT NULL,
            user_id BIGINT NOT NULL,
            job_id BIGINT,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ,
            prompt_snapshot TEXT,
            asset_type INTEGER,
            model_snapshot VARCHAR(128),
            asset_url VARCHAR(1024),
            thumbnail_url VARCHAR(1024),
            status INTEGER NOT NULL,
            deleted_at TIMESTAMPTZ,
            storage_key VARCHAR(512),
            payload_hash VARCHAR(128),
            trace_id VARCHAR(128)
        )"#,
        r#"CREATE TABLE ai_generation_job (
            id BIGINT PRIMARY KEY,
            tenant_id BIGINT NOT NULL,
            organization_id BIGINT NOT NULL,
            user_id BIGINT NOT NULL,
            created_at TIMESTAMPTZ,
            completed_at TIMESTAMPTZ,
            prompt TEXT,
            modality INTEGER,
            job_type INTEGER,
            model VARCHAR(128),
            status INTEGER NOT NULL,
            trace_id VARCHAR(128),
            client_ip_hash VARCHAR(128),
            user_agent_hash VARCHAR(128),
            provider_error TEXT
        )"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_pending_recharge_payment(
    pool: &PgPool,
    out_trade_no: &str,
    amount: &str,
    point_amount: i64,
) {
    let order_id = format!("order-entity-{out_trade_no}");
    let payment_intent_id = format!("payment-intent-{out_trade_no}");
    sqlx::query(
        r#"
        INSERT INTO commerce_order
            (id, tenant_id, organization_id, owner_user_id, order_no, status, subject, currency_code, request_no, idempotency_key, created_at, paid_at, cancelled_at, expired_at, updated_at)
        VALUES
            ($1, '10', '20', '30', $2, 'pending_payment', 'points_recharge', 'CNY', $3, $4, '2026-04-29 00:00:00', NULL, NULL, NULL, '2026-04-29 00:00:00')
        "#,
    )
    .bind(&order_id)
    .bind(out_trade_no)
    .bind(format!("request-{out_trade_no}"))
    .bind(format!("idem-{out_trade_no}"))
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO commerce_payment_intent
            (id, tenant_id, organization_id, owner_user_id, order_id, provider, amount, currency_code, status, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ($1, '10', '20', '30', $2, 'stripe', $3, 'CNY', 'pending', $4, $5, '2026-04-29 00:00:00', '2026-04-29 00:00:00')
        "#,
    )
    .bind(&payment_intent_id)
    .bind(&order_id)
    .bind(amount)
    .bind(format!("payment-request-{out_trade_no}"))
    .bind(format!("payment-idem-{out_trade_no}"))
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO commerce_payment_attempt
            (id, tenant_id, organization_id, owner_user_id, payment_intent_id, order_id, provider, out_trade_no, amount, currency_code, status, callback_payload, created_at, paid_at, updated_at)
        VALUES
            ($1, '10', '20', '30', $2, $3, 'stripe', $4, $5, 'CNY', 'pending', $6, '2026-04-29 00:00:00', NULL, '2026-04-29 00:00:00')
        "#,
    )
    .bind(format!("payment-attempt-{out_trade_no}"))
    .bind(&payment_intent_id)
    .bind(&order_id)
    .bind(out_trade_no)
    .bind(amount)
    .bind(format!(r#"{{"points":{point_amount}}}"#))
    .execute(pool)
    .await
    .unwrap();
}

fn success_command(
    event_id: &str,
    nonce: &str,
    out_trade_no: &str,
    transaction_id: &str,
    amount: Option<&str>,
) -> PaymentCallbackCommand {
    PaymentCallbackCommand {
        provider_code: "stripe".to_owned(),
        event_uuid: format!("{event_id}-uuid"),
        delivery_uuid: format!("{event_id}-delivery"),
        account_uuid: format!("{event_id}-account"),
        account_history_uuid: format!("{event_id}-history"),
        event_id: event_id.to_owned(),
        nonce: nonce.to_owned(),
        signature: Some(format!("{event_id}-signature")),
        request_timestamp: Some(1_777_440_000),
        payload_digest: format!("{event_id}-digest"),
        out_trade_no: out_trade_no.to_owned(),
        transaction_id: transaction_id.to_owned(),
        amount: amount.map(ToOwned::to_owned),
        status: PaymentCallbackStatus::Success,
        received_at: "2026-04-29 00:00:00".to_owned(),
    }
}

fn usage_command(request_id: &str, http_status: u16) -> GatewayUsageRecordCommand {
    GatewayUsageRecordCommand {
        request_id: request_id.to_owned(),
        trace_id: Some("trace-chat-usage-postgres".to_owned()),
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        api_key_id: 101,
        api_key_name_snapshot: "Owner Usage Key".to_owned(),
        channel_group_id: 10,
        channel_group_snapshot: "standard-group".to_owned(),
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        requested_model: "gpt-4o-mini".to_owned(),
        requested_model_catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "gpt-4o-mini".to_owned(),
        provider_native_model: "gpt-4o-mini".to_owned(),
        request_path: "/v1/chat/completions".to_owned(),
        http_method: "POST".to_owned(),
        user_agent: None,
        http_status,
        streaming: false,
        modality: 1,
        usage_type: 1,
        billing_meter_code: "llm_input_token".to_owned(),
        billable_quantity: "18".to_owned(),
        prompt_tokens: 11,
        completion_tokens: 7,
        cached_tokens: 2,
        total_tokens: 18,
        request_count: 1,
        result_count: 0,
        item_count: 0,
        character_count: 0,
        image_count: 0,
        audio_seconds: None,
        video_seconds: None,
        latency_ms: Some(345),
        ttft_ms: Some(120),
        provider_error_code: None,
        error_type: None,
        error_message_masked: None,
        base_input_unit_price: "0.198000".to_owned(),
        base_output_unit_price: "0.792000".to_owned(),
        cache_read_unit_price: "0.099000".to_owned(),
        rate_multiplier: "1.000000".to_owned(),
        reference_multiplier: "1.320000".to_owned(),
        official_reference_amount: "5.850000000000".to_owned(),
        customer_charge_amount: "7.722000".to_owned(),
        upstream_cost_amount: "4.290000".to_owned(),
        currency: "USD".to_owned(),
        pricing_plan_code: "standard".to_owned(),
        pricing_snapshot: r#"{"vendor":{"code":"openai"},"model":{"catalogKey":"openai/global/gpt-4o-mini"},"provider":{"code":"openrouter"},"pricingPlan":{"code":"standard"},"multipliers":{"rate":"1.000000","reference":"1.320000"},"meters":{"input":{"customerUnitPrice":"0.198000"},"output":{"customerUnitPrice":"0.792000"},"cacheRead":{"customerUnitPrice":"0.099000"}}}"#.to_owned(),
    }
}

async fn seed_mixed_generation_history(pool: &PgPool) {
    insert_generation_asset(
        pool,
        101,
        10,
        20,
        30,
        Some(1001),
        "2026-05-03 10:00:00",
        "2026-05-03 10:01:00",
        "commercial hero image",
        2,
        "image-pro",
        "https://cdn.example.test/image-101.png",
        "",
        1,
        None,
        "storage://internal/image-101",
        "payload-hash-101",
        "trace-secret-101",
    )
    .await;
    insert_generation_asset(
        pool,
        102,
        10,
        20,
        30,
        Some(1002),
        "2026-05-03 10:05:00",
        "2026-05-03 10:06:00",
        "commercial launch video",
        3,
        "video-pro",
        "https://cdn.example.test/video-102.mp4",
        "https://cdn.example.test/video-102.jpg",
        2,
        None,
        "storage://internal/video-102",
        "payload-hash-102",
        "trace-secret-102",
    )
    .await;
    insert_generation_job(
        pool,
        201,
        10,
        20,
        30,
        "2026-05-03 10:10:00",
        None,
        "voiceover failed",
        4,
        0,
        "audio-pro",
        3,
    )
    .await;
    insert_generation_job(
        pool,
        301,
        10,
        20,
        30,
        "2026-05-03 10:20:00",
        None,
        "campaign music cancelled",
        5,
        0,
        "music-pro",
        4,
    )
    .await;
    insert_generation_job(
        pool,
        401,
        10,
        20,
        30,
        "2026-05-03 10:30:00",
        None,
        "sfx pending",
        6,
        0,
        "sfx-pro",
        0,
    )
    .await;

    insert_generation_asset(
        pool,
        901,
        99,
        20,
        30,
        None,
        "2026-05-03 11:00:00",
        "2026-05-03 11:00:00",
        "other tenant asset",
        2,
        "image-pro",
        "https://cdn.example.test/other-tenant.png",
        "",
        1,
        None,
        "storage://internal/other-tenant",
        "payload-hash-other-tenant",
        "trace-secret-other-tenant",
    )
    .await;
    insert_generation_job(
        pool,
        902,
        10,
        20,
        31,
        "2026-05-03 11:10:00",
        None,
        "other user job",
        2,
        0,
        "image-pro",
        1,
    )
    .await;
    insert_generation_asset(
        pool,
        903,
        10,
        20,
        30,
        None,
        "2026-05-03 11:20:00",
        "2026-05-03 11:20:00",
        "deleted asset",
        2,
        "image-pro",
        "https://cdn.example.test/deleted.png",
        "",
        1,
        Some("2026-05-03 11:21:00"),
        "storage://internal/deleted",
        "payload-hash-deleted",
        "trace-secret-deleted",
    )
    .await;
    insert_generation_asset(
        pool,
        904,
        10,
        20,
        30,
        None,
        "2026-05-03 11:30:00",
        "2026-05-03 11:30:00",
        "unknown status asset",
        2,
        "image-pro",
        "https://cdn.example.test/unknown.png",
        "",
        99,
        None,
        "storage://internal/unknown",
        "payload-hash-unknown",
        "trace-secret-unknown",
    )
    .await;
    insert_generation_job(
        pool,
        905,
        10,
        20,
        30,
        "2026-05-03 11:40:00",
        None,
        "unknown status job",
        2,
        0,
        "image-pro",
        99,
    )
    .await;
    insert_generation_asset(
        pool,
        906,
        10,
        20,
        30,
        None,
        "2026-05-03 11:50:00",
        "2026-05-03 11:50:00",
        "unknown type asset",
        99,
        "unknown-pro",
        "https://cdn.example.test/unknown-type.bin",
        "",
        1,
        None,
        "storage://internal/unknown-type-asset",
        "payload-hash-unknown-type-asset",
        "trace-secret-unknown-type-asset",
    )
    .await;
    insert_generation_job(
        pool,
        907,
        10,
        20,
        30,
        "2026-05-03 12:00:00",
        None,
        "unknown type job",
        99,
        0,
        "unknown-pro",
        1,
    )
    .await;
}

async fn insert_generation_asset(
    pool: &PgPool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    job_id: Option<i64>,
    created_at: &str,
    updated_at: &str,
    prompt_snapshot: &str,
    asset_type: i32,
    model_snapshot: &str,
    asset_url: &str,
    thumbnail_url: &str,
    status: i32,
    deleted_at: Option<&str>,
    storage_key: &str,
    payload_hash: &str,
    trace_id: &str,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_generation_asset (
            id,
            tenant_id,
            organization_id,
            user_id,
            job_id,
            created_at,
            updated_at,
            prompt_snapshot,
            asset_type,
            model_snapshot,
            asset_url,
            thumbnail_url,
            status,
            deleted_at,
            storage_key,
            payload_hash,
            trace_id
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6::timestamp AT TIME ZONE 'UTC',
            $7::timestamp AT TIME ZONE 'UTC',
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14::timestamp AT TIME ZONE 'UTC',
            $15,
            $16,
            $17
        )
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(user_id)
    .bind(job_id)
    .bind(created_at)
    .bind(updated_at)
    .bind(prompt_snapshot)
    .bind(asset_type)
    .bind(model_snapshot)
    .bind(asset_url)
    .bind(thumbnail_url)
    .bind(status)
    .bind(deleted_at)
    .bind(storage_key)
    .bind(payload_hash)
    .bind(trace_id)
    .execute(pool)
    .await
    .unwrap();
}

async fn insert_generation_job(
    pool: &PgPool,
    id: i64,
    tenant_id: i64,
    organization_id: i64,
    user_id: i64,
    created_at: &str,
    completed_at: Option<&str>,
    prompt: &str,
    modality: i32,
    job_type: i32,
    model: &str,
    status: i32,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_generation_job (
            id,
            tenant_id,
            organization_id,
            user_id,
            created_at,
            completed_at,
            prompt,
            modality,
            job_type,
            model,
            status,
            trace_id,
            client_ip_hash,
            user_agent_hash,
            provider_error
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5::timestamp AT TIME ZONE 'UTC',
            $6::timestamp AT TIME ZONE 'UTC',
            $7,
            $8,
            $9,
            $10,
            $11,
            'trace-secret-201',
            'ip-hash-201',
            'ua-hash-201',
            'provider raw error'
        )
        "#,
    )
    .bind(id)
    .bind(tenant_id)
    .bind(organization_id)
    .bind(user_id)
    .bind(created_at)
    .bind(completed_at)
    .bind(prompt)
    .bind(modality)
    .bind(job_type)
    .bind(model)
    .bind(status)
    .execute(pool)
    .await
    .unwrap();
}

async fn scalar_i64(pool: &PgPool, sql: &str) -> i64 {
    sqlx::query(sql)
        .fetch_one(pool)
        .await
        .unwrap()
        .try_get::<i64, _>(0)
        .unwrap()
}

fn unique_schema_name(label: &str) -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0);
    format!("sdkwork_claw_it_{label}_{millis}")
}

fn quote_identifier(value: &str) -> String {
    format!("\"{}\"", value.replace('"', "\"\""))
}
