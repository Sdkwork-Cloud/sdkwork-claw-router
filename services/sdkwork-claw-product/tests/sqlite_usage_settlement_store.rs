use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteUsageSettlementStore;
use sdkwork_claw_product::ports::{UsageSettlementCommand, UsageSettlementStore};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};

#[tokio::test]
async fn sqlite_usage_settlement_debits_points_once_and_links_usage_to_ledger() {
    let pool = test_pool().await;
    seed_points_account(&pool, 701, 1000).await;
    seed_usage_fact(&pool, 501, "req-usage-501", "7.722000", 18, Some(0)).await;
    let store = SqliteUsageSettlementStore::new(pool.clone());

    let outcome = store
        .settle_pending_usage(settlement_command())
        .await
        .unwrap();
    let duplicate = store
        .settle_pending_usage(settlement_command())
        .await
        .unwrap();

    assert_eq!(1, outcome.settled_count);
    assert_eq!(0, outcome.failed_count);
    assert_eq!(78, outcome.debited_points);
    assert_eq!(0, duplicate.settled_count);
    assert_eq!(0, duplicate.failed_count);
    assert_eq!(0, duplicate.debited_points);
    assert_eq!(
        922,
        scalar_i64(
            &pool,
            "SELECT available_points FROM plus_account WHERE id = 701"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(&pool, "SELECT COUNT(1) FROM commerce_usage_settlement").await
    );
    assert_eq!(
        1,
        scalar_i64(&pool, "SELECT COUNT(1) FROM plus_account_history").await
    );

    let settlement = sqlx::query(
        r#"
        SELECT id, settlement_no, usage_fact_id, account_id, account_history_id, amount, points, tokens, currency, settlement_status, failure_code
        FROM commerce_usage_settlement
        WHERE usage_fact_id = 501
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let settlement_id = settlement.get::<i64, _>("id");
    let account_history_id = settlement.get::<i64, _>("account_history_id");
    let settlement_no = settlement.get::<String, _>("settlement_no");
    assert_eq!("usage-settlement-501", settlement_no);
    assert_eq!(501, settlement.get::<i64, _>("usage_fact_id"));
    assert_eq!(701, settlement.get::<i64, _>("account_id"));
    assert!(account_history_id > 0);
    assert_eq!("7.722000", settlement.get::<String, _>("amount"));
    assert_eq!(78, settlement.get::<i64, _>("points"));
    assert_eq!(18, settlement.get::<i64, _>("tokens"));
    assert_eq!("USD", settlement.get::<String, _>("currency"));
    assert_eq!(2, settlement.get::<i64, _>("settlement_status"));
    assert_eq!(
        None::<String>,
        settlement.get::<Option<String>, _>("failure_code")
    );

    let ledger = sqlx::query(
        r#"
        SELECT transaction_id, transaction_type, asset_type, points_change, points_before, points_after, source_type, source_id, status, usage_result, remarks
        FROM plus_account_history
        WHERE id = ?
        "#,
    )
    .bind(account_history_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(settlement_no, ledger.get::<String, _>("transaction_id"));
    assert_eq!(22, ledger.get::<i64, _>("transaction_type"));
    assert_eq!(2, ledger.get::<i64, _>("asset_type"));
    assert_eq!(-78, ledger.get::<i64, _>("points_change"));
    assert_eq!(1000, ledger.get::<i64, _>("points_before"));
    assert_eq!(922, ledger.get::<i64, _>("points_after"));
    assert_eq!(8, ledger.get::<i64, _>("source_type"));
    assert_eq!(
        settlement_id.to_string(),
        ledger.get::<String, _>("source_id")
    );
    assert_eq!(2, ledger.get::<i64, _>("status"));
    assert!(ledger
        .get::<String, _>("usage_result")
        .contains("\"usage_fact_id\":501"));
    assert!(ledger
        .get::<String, _>("remarks")
        .contains("usage_request=req-usage-501"));

    let usage =
        sqlx::query("SELECT settlement_status, settlement_id FROM ai_usage_fact WHERE id = 501")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(2, usage.get::<i64, _>("settlement_status"));
    assert_eq!(settlement_id, usage.get::<i64, _>("settlement_id"));
}

#[tokio::test]
async fn sqlite_usage_settlement_skips_usage_without_explicit_settlement_status() {
    let pool = test_pool().await;
    seed_points_account(&pool, 701, 1000).await;
    seed_usage_fact(&pool, 504, "req-usage-504", "5.000000", 10, None).await;
    let store = SqliteUsageSettlementStore::new(pool.clone());

    let outcome = store
        .settle_pending_usage(settlement_command())
        .await
        .unwrap();

    assert_eq!(0, outcome.settled_count);
    assert_eq!(0, outcome.failed_count);
    assert_eq!(0, outcome.debited_points);
    assert_eq!(
        1000,
        scalar_i64(
            &pool,
            "SELECT available_points FROM plus_account WHERE id = 701"
        )
        .await
    );
    assert_eq!(
        0,
        scalar_i64(&pool, "SELECT COUNT(1) FROM commerce_usage_settlement").await
    );
    assert_eq!(
        0,
        scalar_i64(&pool, "SELECT COUNT(1) FROM plus_account_history").await
    );
    assert!(
        sqlx::query("SELECT settlement_status FROM ai_usage_fact WHERE id = 504")
            .fetch_one(&pool)
            .await
            .unwrap()
            .get::<Option<i64>, _>("settlement_status")
            .is_none()
    );
}

#[tokio::test]
async fn sqlite_usage_settlement_marks_insufficient_points_failed_and_allows_retry() {
    let pool = test_pool().await;
    seed_points_account(&pool, 701, 1000).await;
    seed_usage_fact(&pool, 502, "req-usage-502", "100.010000", 99, Some(0)).await;
    let store = SqliteUsageSettlementStore::new(pool.clone());

    let failed = store
        .settle_pending_usage(settlement_command())
        .await
        .unwrap();

    assert_eq!(0, failed.settled_count);
    assert_eq!(1, failed.failed_count);
    assert_eq!(0, failed.debited_points);
    assert_eq!(
        1000,
        scalar_i64(
            &pool,
            "SELECT available_points FROM plus_account WHERE id = 701"
        )
        .await
    );
    assert_eq!(
        0,
        scalar_i64(&pool, "SELECT COUNT(1) FROM plus_account_history").await
    );
    assert_eq!(
        3,
        scalar_i64(
            &pool,
            "SELECT settlement_status FROM ai_usage_fact WHERE id = 502"
        )
        .await
    );
    assert_eq!(
        "INSUFFICIENT_POINTS",
        scalar_string(
            &pool,
            "SELECT failure_code FROM commerce_usage_settlement WHERE usage_fact_id = 502"
        )
        .await
    );

    sqlx::query("UPDATE plus_account SET available_points = 2000 WHERE id = 701")
        .execute(&pool)
        .await
        .unwrap();
    let retried = store
        .settle_pending_usage(settlement_command())
        .await
        .unwrap();

    assert_eq!(1, retried.settled_count);
    assert_eq!(0, retried.failed_count);
    assert_eq!(1001, retried.debited_points);
    assert_eq!(
        999,
        scalar_i64(
            &pool,
            "SELECT available_points FROM plus_account WHERE id = 701"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(&pool, "SELECT COUNT(1) FROM commerce_usage_settlement").await
    );
    assert_eq!(
        1,
        scalar_i64(&pool, "SELECT COUNT(1) FROM plus_account_history").await
    );
    assert_eq!(
        2,
        scalar_i64(
            &pool,
            "SELECT settlement_status FROM ai_usage_fact WHERE id = 502"
        )
        .await
    );
    assert_eq!(
        2,
        scalar_i64(
            &pool,
            "SELECT settlement_status FROM commerce_usage_settlement WHERE usage_fact_id = 502"
        )
        .await
    );
    assert_eq!(
        0,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM commerce_usage_settlement WHERE usage_fact_id = 502 AND failure_code IS NOT NULL"
        )
        .await
    );
}

#[tokio::test]
async fn sqlite_usage_settlement_zero_tenant_command_settles_global_pending_usage() {
    let pool = test_pool().await;
    seed_points_account(&pool, 701, 1000).await;
    seed_usage_fact(&pool, 503, "req-usage-503", "0.990000", 2, Some(0)).await;
    let store = SqliteUsageSettlementStore::new(pool.clone());

    let outcome = store
        .settle_pending_usage(UsageSettlementCommand {
            tenant_id: 0,
            organization_id: 0,
            limit: 50,
            requested_at: "2026-04-30T12:00:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!(1, outcome.settled_count);
    assert_eq!(10, outcome.debited_points);
    assert_eq!(
        2,
        scalar_i64(
            &pool,
            "SELECT settlement_status FROM ai_usage_fact WHERE id = 503"
        )
        .await
    );
    assert_eq!(
        990,
        scalar_i64(
            &pool,
            "SELECT available_points FROM plus_account WHERE id = 701"
        )
        .await
    );
}

fn settlement_command() -> UsageSettlementCommand {
    UsageSettlementCommand {
        tenant_id: 10,
        organization_id: 20,
        limit: 50,
        requested_at: "2026-04-30T12:00:00Z".to_owned(),
    }
}

async fn test_pool() -> SqlitePool {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    create_schema(&pool).await;
    pool
}

async fn create_schema(pool: &SqlitePool) {
    for statement in [
        r#"CREATE TABLE ai_usage_fact (
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
            owner_name_snapshot TEXT,
            model TEXT,
            provider_id INTEGER,
            channel_id INTEGER,
            provider_account_id INTEGER,
            modality INTEGER,
            usage_type INTEGER,
            billing_type INTEGER,
            billing_mode INTEGER,
            billing_meter_id INTEGER,
            billing_meter_code TEXT,
            billing_tier TEXT,
            billable_quantity TEXT,
            billable_unit INTEGER,
            prompt_tokens INTEGER,
            completion_tokens INTEGER,
            cached_tokens INTEGER,
            total_tokens INTEGER,
            request_count INTEGER,
            unit_price_snapshot TEXT,
            base_input_unit_price TEXT,
            base_output_unit_price TEXT,
            customer_charge_amount TEXT,
            cost_amount TEXT,
            currency TEXT,
            pricing_plan_code TEXT,
            pricing_snapshot TEXT,
            occurred_at TEXT,
            settlement_status INTEGER,
            settlement_id INTEGER,
            UNIQUE (tenant_id, organization_id, request_id, usage_type)
        )"#,
        r#"CREATE TABLE commerce_usage_settlement (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER,
            request_id TEXT,
            trace_id TEXT,
            status INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            metadata TEXT NOT NULL,
            settlement_no TEXT,
            usage_fact_id INTEGER NOT NULL,
            account_id INTEGER,
            account_history_id INTEGER,
            asset_type INTEGER,
            direction INTEGER,
            amount TEXT,
            points INTEGER,
            tokens INTEGER,
            currency TEXT,
            price_snapshot TEXT,
            settlement_status INTEGER,
            settled_at TEXT,
            failure_code TEXT,
            failure_message TEXT,
            UNIQUE (tenant_id, organization_id, usage_fact_id)
        )"#,
        r#"CREATE TABLE plus_account (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            account_type INTEGER NOT NULL,
            owner INTEGER,
            owner_id INTEGER,
            available_balance TEXT,
            frozen_balance TEXT,
            available_points INTEGER,
            frozen_points INTEGER,
            token_balance INTEGER,
            frozen_token INTEGER,
            status INTEGER NOT NULL,
            UNIQUE (tenant_id, organization_id, user_id, account_type)
        )"#,
        r#"CREATE TABLE plus_account_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
            account_type INTEGER,
            asset_type INTEGER,
            account_id INTEGER,
            transaction_id TEXT,
            transaction_type INTEGER,
            points_change INTEGER,
            points_before INTEGER,
            points_after INTEGER,
            source_type INTEGER,
            source_id TEXT,
            status INTEGER,
            usage_result TEXT,
            remarks TEXT
        )"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_points_account(pool: &SqlitePool, account_id: i64, available_points: i64) {
    sqlx::query(
        r#"
        INSERT INTO plus_account
            (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status)
        VALUES
            (?, ?, 10, 20, 1, '2026-04-30T11:59:00Z', '2026-04-30T11:59:00Z', 0, 30, 2, 0, 30, '0', '0', ?, 0, 0, 0, 1)
        "#,
    )
    .bind(account_id)
    .bind(format!("account-{account_id}"))
    .bind(available_points)
    .execute(pool)
    .await
    .unwrap();
}

async fn seed_usage_fact(
    pool: &SqlitePool,
    usage_fact_id: i64,
    request_id: &str,
    amount: &str,
    total_tokens: i64,
    settlement_status: Option<i64>,
) {
    sqlx::query(
        r#"
        INSERT INTO ai_usage_fact
            (id, uuid, tenant_id, organization_id, user_id, request_id, trace_id, status,
             api_key_id, api_key_name_snapshot, api_key_group_id, api_key_group_snapshot,
             owner_type, owner_id, owner_name_snapshot, model, provider_id, channel_id, modality,
             usage_type, billing_meter_code, billable_quantity, prompt_tokens, cached_tokens,
             completion_tokens, total_tokens, request_count, unit_price_snapshot,
             base_input_unit_price, base_output_unit_price, customer_charge_amount, cost_amount,
             currency, pricing_plan_code, pricing_snapshot, occurred_at, settlement_status)
        VALUES
            (?, ?, 10, 20, 30, ?, ?, 1, 101, 'Owner Usage Key', 10, 'standard-group',
             1, 30, 'Demo User', 'gpt-4o-mini', 9001, 3001, 1, 1, 'llm_input_token',
             ?, 11, 2, 7, ?, 1, '0.198000', '0.198000', '0.792000',
             ?, '4.290000', 'USD', 'standard', '{}', '2026-04-30T11:58:00Z', ?)
        "#,
    )
    .bind(usage_fact_id)
    .bind(format!("usage-{usage_fact_id}"))
    .bind(request_id)
    .bind(format!("trace-{usage_fact_id}"))
    .bind(total_tokens.to_string())
    .bind(total_tokens)
    .bind(amount)
    .bind(settlement_status)
    .execute(pool)
    .await
    .unwrap();
}

async fn scalar_i64(pool: &SqlitePool, sql: &str) -> i64 {
    sqlx::query(sql)
        .fetch_one(pool)
        .await
        .unwrap()
        .try_get::<i64, _>(0)
        .unwrap()
}

async fn scalar_string(pool: &SqlitePool, sql: &str) -> String {
    sqlx::query(sql)
        .fetch_one(pool)
        .await
        .unwrap()
        .try_get::<String, _>(0)
        .unwrap()
}
