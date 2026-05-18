use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteGatewayUsageRecorder;
use sdkwork_claw_product::ports::{GatewayUsageRecordCommand, GatewayUsageRecorder};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::Row;

#[tokio::test]
async fn sqlite_gateway_usage_recorder_upserts_trace_and_usage_fact_without_duplicates() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_usage_tables(&pool).await;
    let recorder = SqliteGatewayUsageRecorder::new(pool.clone());
    let command = usage_command("req-chat-usage-sqlite", 200);

    recorder
        .record_gateway_usage(command.clone())
        .await
        .unwrap();
    recorder.record_gateway_usage(command).await.unwrap();

    let trace = sqlx::query(
        "SELECT request_id, trace_id, tenant_id, organization_id, user_id, api_key_id, api_key_group_snapshot, requested_model, provider_model, http_status, streaming, prompt_tokens, completion_tokens, total_tokens FROM ai_request_trace",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "req-chat-usage-sqlite",
        trace.get::<String, _>("request_id")
    );
    assert_eq!(
        "trace-chat-usage-sqlite",
        trace.get::<String, _>("trace_id")
    );
    assert_eq!(10_i64, trace.get::<i64, _>("tenant_id"));
    assert_eq!(20_i64, trace.get::<i64, _>("organization_id"));
    assert_eq!(30_i64, trace.get::<i64, _>("user_id"));
    assert_eq!(101_i64, trace.get::<i64, _>("api_key_id"));
    assert_eq!(
        "standard-group",
        trace.get::<String, _>("api_key_group_snapshot")
    );
    assert_eq!("gpt-4o-mini", trace.get::<String, _>("requested_model"));
    assert_eq!(
        "openai/global/gpt-4o-mini",
        trace.get::<String, _>("provider_model")
    );
    assert_eq!(200_i64, trace.get::<i64, _>("http_status"));
    assert_eq!(0_i64, trace.get::<i64, _>("streaming"));
    assert_eq!(11_i64, trace.get::<i64, _>("prompt_tokens"));
    assert_eq!(7_i64, trace.get::<i64, _>("completion_tokens"));
    assert_eq!(18_i64, trace.get::<i64, _>("total_tokens"));

    let usage = sqlx::query(
        "SELECT request_id, api_key_id, catalog_key, model, channel_id, usage_type, billing_meter_code, billable_quantity, prompt_tokens, completion_tokens, cached_tokens, total_tokens, customer_charge_amount, cost_amount, currency, pricing_plan_code, occurred_at, settlement_status FROM ai_usage_fact",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        "req-chat-usage-sqlite",
        usage.get::<String, _>("request_id")
    );
    assert_eq!(101_i64, usage.get::<i64, _>("api_key_id"));
    assert_eq!(
        "openai/global/gpt-4o-mini",
        usage.get::<String, _>("catalog_key")
    );
    assert_eq!("gpt-4o-mini", usage.get::<String, _>("model"));
    assert_eq!(3001_i64, usage.get::<i64, _>("channel_id"));
    assert_eq!(1_i64, usage.get::<i64, _>("usage_type"));
    assert_eq!(
        "llm_input_token",
        usage.get::<String, _>("billing_meter_code")
    );
    assert_eq!("18", usage.get::<String, _>("billable_quantity"));
    assert_eq!(11_i64, usage.get::<i64, _>("prompt_tokens"));
    assert_eq!(7_i64, usage.get::<i64, _>("completion_tokens"));
    assert_eq!(2_i64, usage.get::<i64, _>("cached_tokens"));
    assert_eq!(18_i64, usage.get::<i64, _>("total_tokens"));
    assert_eq!("7.722000", usage.get::<String, _>("customer_charge_amount"));
    assert_eq!("4.290000", usage.get::<String, _>("cost_amount"));
    assert_eq!("USD", usage.get::<String, _>("currency"));
    assert_eq!("standard", usage.get::<String, _>("pricing_plan_code"));
    assert_eq!(0_i64, usage.get::<i64, _>("settlement_status"));
    let occurred_at = usage.get::<String, _>("occurred_at");
    assert!(
        occurred_at.contains('T') && occurred_at.ends_with('Z'),
        "SQLite usage facts must store occurred_at as RFC3339 UTC text, got {occurred_at}"
    );
    assert!(
        !occurred_at.contains(' '),
        "SQLite usage facts must not store occurred_at as SQLite CURRENT_TIMESTAMP text"
    );

    let trace_count = sqlx::query("SELECT COUNT(*) AS count FROM ai_request_trace")
        .fetch_one(&pool)
        .await
        .unwrap()
        .get::<i64, _>("count");
    let usage_count = sqlx::query("SELECT COUNT(*) AS count FROM ai_usage_fact")
        .fetch_one(&pool)
        .await
        .unwrap()
        .get::<i64, _>("count");
    assert_eq!(1, trace_count);
    assert_eq!(1, usage_count);
}

#[tokio::test]
async fn sqlite_gateway_usage_recorder_uses_command_modality_and_meter() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_usage_tables(&pool).await;
    let recorder = SqliteGatewayUsageRecorder::new(pool.clone());
    let mut command = usage_command("req-embedding-usage-sqlite", 200);
    command.catalog_key = "openai/global/text-embedding-3-small".to_owned();
    command.requested_model = "text-embedding-3-small".to_owned();
    command.provider_model = "openai/global/text-embedding-3-small".to_owned();
    command.request_path = "/v1/embeddings".to_owned();
    command.modality = 6;
    command.billing_meter_code = "embedding_input_token".to_owned();
    command.prompt_tokens = 13;
    command.completion_tokens = 0;
    command.cached_tokens = 0;
    command.total_tokens = 13;
    command.base_input_unit_price = "0.026400".to_owned();
    command.base_output_unit_price = "0.000000".to_owned();
    command.customer_charge_amount = "0.343200".to_owned();
    command.upstream_cost_amount = "0.130000".to_owned();

    recorder.record_gateway_usage(command).await.unwrap();

    let usage = sqlx::query(
        r#"
        SELECT request_id, modality, usage_type, billing_meter_code, billable_quantity,
               prompt_tokens, completion_tokens, total_tokens, customer_charge_amount, cost_amount
        FROM ai_usage_fact
        WHERE request_id = 'req-embedding-usage-sqlite'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(6_i64, usage.get::<i64, _>("modality"));
    assert_eq!(1_i64, usage.get::<i64, _>("usage_type"));
    assert_eq!(
        "embedding_input_token",
        usage.get::<String, _>("billing_meter_code")
    );
    assert_eq!("13", usage.get::<String, _>("billable_quantity"));
    assert_eq!(13_i64, usage.get::<i64, _>("prompt_tokens"));
    assert_eq!(0_i64, usage.get::<i64, _>("completion_tokens"));
    assert_eq!(13_i64, usage.get::<i64, _>("total_tokens"));
    assert_eq!("0.343200", usage.get::<String, _>("customer_charge_amount"));
    assert_eq!("0.130000", usage.get::<String, _>("cost_amount"));
}

#[tokio::test]
async fn sqlite_gateway_usage_recorder_preserves_successfully_settled_usage_fact_on_duplicate_request_id(
) {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_usage_tables(&pool).await;
    let recorder = SqliteGatewayUsageRecorder::new(pool.clone());

    let mut command = usage_command("req-chat-usage-settled", 200);
    recorder
        .record_gateway_usage(command.clone())
        .await
        .unwrap();
    sqlx::query(
        r#"
        UPDATE ai_usage_fact
        SET settlement_status = 2,
            customer_charge_amount = '7.722000',
            cost_amount = '4.290000',
            total_tokens = 18
        WHERE request_id = 'req-chat-usage-settled'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    command.prompt_tokens = 99;
    command.completion_tokens = 88;
    command.cached_tokens = 0;
    command.total_tokens = 187;
    command.customer_charge_amount = "999.000000".to_owned();
    command.upstream_cost_amount = "555.000000".to_owned();
    recorder.record_gateway_usage(command).await.unwrap();

    let usage = sqlx::query(
        r#"
        SELECT total_tokens, customer_charge_amount, cost_amount, settlement_status
        FROM ai_usage_fact
        WHERE request_id = 'req-chat-usage-settled'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(18_i64, usage.get::<i64, _>("total_tokens"));
    assert_eq!("7.722000", usage.get::<String, _>("customer_charge_amount"));
    assert_eq!("4.290000", usage.get::<String, _>("cost_amount"));
    assert_eq!(
        2_i64,
        usage.get::<i64, _>("settlement_status"),
        "a duplicate gateway request id must not reopen a successfully settled usage fact"
    );

    let trace = sqlx::query(
        r#"
        SELECT total_tokens, http_status
        FROM ai_request_trace
        WHERE request_id = 'req-chat-usage-settled'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        18_i64,
        trace.get::<i64, _>("total_tokens"),
        "a duplicate gateway request id must not rewrite trace tokens after usage settlement succeeds"
    );
    assert_eq!(200_i64, trace.get::<i64, _>("http_status"));
}

#[tokio::test]
async fn sqlite_gateway_usage_recorder_preserves_unknown_settlement_usage_fact_on_duplicate_request_id(
) {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_usage_tables(&pool).await;
    let recorder = SqliteGatewayUsageRecorder::new(pool.clone());

    let mut command = usage_command("req-chat-usage-unknown-settlement", 200);
    recorder
        .record_gateway_usage(command.clone())
        .await
        .unwrap();
    sqlx::query(
        r#"
        UPDATE ai_usage_fact
        SET settlement_status = NULL,
            customer_charge_amount = '7.722000',
            cost_amount = '4.290000',
            total_tokens = 18
        WHERE request_id = 'req-chat-usage-unknown-settlement'
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    command.prompt_tokens = 99;
    command.completion_tokens = 88;
    command.cached_tokens = 0;
    command.total_tokens = 187;
    command.customer_charge_amount = "999.000000".to_owned();
    command.upstream_cost_amount = "555.000000".to_owned();
    recorder.record_gateway_usage(command).await.unwrap();

    let usage = sqlx::query(
        r#"
        SELECT total_tokens, customer_charge_amount, cost_amount, settlement_status
        FROM ai_usage_fact
        WHERE request_id = 'req-chat-usage-unknown-settlement'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(18_i64, usage.get::<i64, _>("total_tokens"));
    assert_eq!("7.722000", usage.get::<String, _>("customer_charge_amount"));
    assert_eq!("4.290000", usage.get::<String, _>("cost_amount"));
    assert!(
        usage
            .get::<Option<i64>, _>("settlement_status")
            .is_none(),
        "a duplicate gateway request id must not convert an unknown settlement status back to pending"
    );

    let trace = sqlx::query(
        r#"
        SELECT total_tokens, http_status
        FROM ai_request_trace
        WHERE request_id = 'req-chat-usage-unknown-settlement'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        18_i64,
        trace.get::<i64, _>("total_tokens"),
        "a duplicate gateway request id must not rewrite trace tokens when usage settlement status is unknown"
    );
    assert_eq!(200_i64, trace.get::<i64, _>("http_status"));
}

#[tokio::test]
async fn sqlite_gateway_usage_recorder_preserves_failed_settlement_usage_fact_on_duplicate_request_id(
) {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_usage_tables(&pool).await;
    let recorder = SqliteGatewayUsageRecorder::new(pool.clone());

    let mut command = usage_command("req-chat-usage-settlement-failed", 200);
    recorder
        .record_gateway_usage(command.clone())
        .await
        .unwrap();
    sqlx::query(
        r#"
        UPDATE ai_usage_fact
        SET settlement_status = 3,
            customer_charge_amount = '7.722000',
            cost_amount = '4.290000',
            total_tokens = 18
        WHERE request_id = 'req-chat-usage-settlement-failed'
        "#,
    )
    .execute(&pool)
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
        SELECT total_tokens, customer_charge_amount, cost_amount, settlement_status
        FROM ai_usage_fact
        WHERE request_id = 'req-chat-usage-settlement-failed'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(18_i64, usage.get::<i64, _>("total_tokens"));
    assert_eq!("7.722000", usage.get::<String, _>("customer_charge_amount"));
    assert_eq!("4.290000", usage.get::<String, _>("cost_amount"));
    assert_eq!(
        3_i64,
        usage.get::<i64, _>("settlement_status"),
        "a duplicate gateway request id must not rewrite a failed usage settlement before retry"
    );

    let trace = sqlx::query(
        r#"
        SELECT total_tokens, http_status
        FROM ai_request_trace
        WHERE request_id = 'req-chat-usage-settlement-failed'
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(
        18_i64,
        trace.get::<i64, _>("total_tokens"),
        "a duplicate gateway request id must not rewrite trace tokens after usage settlement fails"
    );
    assert_eq!(200_i64, trace.get::<i64, _>("http_status"));
}

fn usage_command(request_id: &str, http_status: u16) -> GatewayUsageRecordCommand {
    GatewayUsageRecordCommand {
        request_id: request_id.to_owned(),
        trace_id: Some("trace-chat-usage-sqlite".to_owned()),
        tenant_id: 10,
        organization_id: 20,
        user_id: 30,
        api_key_id: 101,
        api_key_name_snapshot: "Owner Usage Key".to_owned(),
        api_key_group_id: 10,
        api_key_group_snapshot: "standard-group".to_owned(),
        catalog_key: "openai/global/gpt-4o-mini".to_owned(),
        requested_model: "gpt-4o-mini".to_owned(),
        provider_code: "openrouter".to_owned(),
        channel_id: 3001,
        provider_model: "openai/global/gpt-4o-mini".to_owned(),
        request_path: "/v1/chat/completions".to_owned(),
        http_method: "POST".to_owned(),
        http_status,
        streaming: false,
        modality: 1,
        usage_type: 1,
        billing_meter_code: "llm_input_token".to_owned(),
        prompt_tokens: 11,
        completion_tokens: 7,
        cached_tokens: 2,
        total_tokens: 18,
        base_input_unit_price: "0.198000".to_owned(),
        base_output_unit_price: "0.792000".to_owned(),
        customer_charge_amount: "7.722000".to_owned(),
        upstream_cost_amount: "4.290000".to_owned(),
        currency: "USD".to_owned(),
        pricing_plan_code: "standard".to_owned(),
    }
}

async fn create_usage_tables(pool: &sqlx::SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE ai_request_trace (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            trace_id TEXT,
            status INTEGER NOT NULL,
            attempt_no INTEGER,
            api_key_id INTEGER,
            api_key_name_snapshot TEXT,
            api_key_group_id INTEGER,
            api_key_group_snapshot TEXT,
            owner_type INTEGER,
            owner_id INTEGER,
            channel_id INTEGER,
            channel_name_snapshot TEXT,
            requested_model TEXT,
            provider_model TEXT,
            endpoint TEXT,
            request_path TEXT,
            http_method TEXT,
            http_status INTEGER,
            started_at TEXT,
            ended_at TEXT,
            streaming INTEGER,
            prompt_tokens INTEGER,
            cached_tokens INTEGER,
            completion_tokens INTEGER,
            total_tokens INTEGER,
            UNIQUE (tenant_id, organization_id, request_id, attempt_no)
        )
        "#,
        r#"
        CREATE TABLE ai_usage_fact (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            trace_id TEXT,
            status INTEGER NOT NULL,
            api_key_id INTEGER,
            api_key_name_snapshot TEXT,
            api_key_group_id INTEGER,
            api_key_group_snapshot TEXT,
            owner_type INTEGER,
            owner_id INTEGER,
            catalog_key TEXT NOT NULL,
            model TEXT,
            channel_id INTEGER,
            modality INTEGER,
            usage_type INTEGER,
            billing_meter_code TEXT,
            billable_quantity TEXT,
            prompt_tokens INTEGER,
            cached_tokens INTEGER,
            completion_tokens INTEGER,
            total_tokens INTEGER,
            request_count INTEGER,
            unit_price_snapshot TEXT,
            base_input_unit_price TEXT,
            base_output_unit_price TEXT,
            customer_charge_amount TEXT,
            cost_amount TEXT,
            currency TEXT,
            pricing_plan_code TEXT,
            occurred_at TEXT,
            settlement_status INTEGER,
            UNIQUE (tenant_id, organization_id, request_id, usage_type)
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}
