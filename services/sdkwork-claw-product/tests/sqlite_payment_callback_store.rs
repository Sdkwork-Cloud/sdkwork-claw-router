use sdkwork_claw_product::infrastructure::sql::sqlite::SqlitePaymentCallbackStore;
use sdkwork_claw_product::ports::{
    PaymentCallbackCommand, PaymentCallbackStatus, PaymentCallbackStore,
};
use sdkwork_commerce_storage_sqlx::commerce_database_tables;
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};

const SQLITE_PAYMENT_CALLBACK_STORE: &str =
    include_str!("../src/infrastructure/sql/sqlite/payment_callback_store.rs");
const POSTGRES_PAYMENT_CALLBACK_STORE: &str =
    include_str!("../src/infrastructure/sql/postgres/payment_callback_store.rs");

#[test]
fn payment_callback_uses_appbase_order_payment_and_accounting_schema() {
    let appbase_tables = commerce_database_tables();
    assert!(appbase_tables.contains(&"commerce_order"));
    assert!(appbase_tables.contains(&"commerce_payment_intent"));
    assert!(appbase_tables.contains(&"commerce_payment_attempt"));
    assert!(appbase_tables.contains(&"commerce_payment_webhook_event"));
    assert!(appbase_tables.contains(&"commerce_account"));
    assert!(appbase_tables.contains(&"commerce_account_ledger_entry"));

    for source in [
        SQLITE_PAYMENT_CALLBACK_STORE,
        POSTGRES_PAYMENT_CALLBACK_STORE,
    ] {
        assert!(source.contains("commerce_order"));
        assert!(source.contains("commerce_payment_intent"));
        assert!(source.contains("commerce_payment_attempt"));
        assert!(source.contains("commerce_payment_webhook_event"));
        assert!(source.contains("commerce_account"));
        assert!(source.contains("commerce_account_ledger_entry"));
        assert!(!source.contains("plus_order"));
        assert!(!source.contains("FROM plus_payment "));
        assert!(!source.contains("UPDATE plus_payment "));
        assert!(!source.contains("plus_payment_webhook_event"));
        assert!(!source.contains("plus_vip_recharge"));
        assert!(!source.contains("plus_account "));
        assert!(!source.contains("plus_account_history"));
        assert!(!source.contains("plus_vip_point_change"));
        assert!(!source.contains("vip_recharge"));
    }
}

#[tokio::test]
async fn sqlite_payment_callback_fulfills_appbase_recharge_once_and_records_webhook_success() {
    let pool = test_pool().await;
    let store = SqlitePaymentCallbackStore::new(pool.clone());
    seed_pending_recharge_payment(&pool, "order-1001", "payment-1001", "88.50", 880).await;

    let outcome = store
        .process_payment_callback(success_command(
            "evt-1001",
            "nonce-1001",
            "order-1001",
            "txn-1001",
            Some("88.50"),
        ))
        .await
        .unwrap();

    assert!(outcome.success);
    assert!(!outcome.duplicate);
    assert_eq!(880, outcome.credited_points);
    assert_eq!(1880, outcome.balance);
    assert_eq!(
        "succeeded",
        scalar_string(
            &pool,
            "SELECT status FROM commerce_payment_attempt WHERE out_trade_no = 'order-1001'"
        )
        .await
    );
    assert_eq!(
        "succeeded",
        scalar_string(
            &pool,
            "SELECT status FROM commerce_payment_intent WHERE id = 'payment-1001'"
        )
        .await
    );
    assert_eq!(
        "paid",
        scalar_string(
            &pool,
            "SELECT status FROM commerce_order WHERE id = 'order-entity-order-1001'"
        )
        .await
    );
    assert_eq!(
        1880,
        scalar_i64(
            &pool,
            "SELECT CAST(available_amount AS INTEGER) FROM commerce_account WHERE owner_user_id = '30' AND asset_type = 'points'"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM commerce_account_ledger_entry WHERE transaction_no = 'order-1001' AND business_type = 'recharge'"
        )
        .await
    );
    assert_eq!(
        "SUCCESS",
        scalar_string(
            &pool,
            "SELECT status FROM commerce_payment_webhook_event WHERE event_id = 'evt-1001'"
        )
        .await
    );
}

#[tokio::test]
async fn sqlite_payment_callback_duplicate_event_does_not_credit_twice() {
    let pool = test_pool().await;
    let store = SqlitePaymentCallbackStore::new(pool.clone());
    seed_pending_recharge_payment(&pool, "order-1002", "payment-1002", "30.00", 300).await;

    let first = store
        .process_payment_callback(success_command(
            "evt-1002",
            "nonce-1002",
            "order-1002",
            "txn-1002",
            Some("30.00"),
        ))
        .await
        .unwrap();
    let duplicate = store
        .process_payment_callback(success_command(
            "evt-1002",
            "nonce-1002",
            "order-1002",
            "txn-1002",
            Some("30.00"),
        ))
        .await
        .unwrap();

    assert!(!first.duplicate);
    assert!(duplicate.duplicate);
    assert_eq!(
        1300,
        scalar_i64(
            &pool,
            "SELECT CAST(available_amount AS INTEGER) FROM commerce_account WHERE owner_user_id = '30' AND asset_type = 'points'"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM commerce_account_ledger_entry WHERE transaction_no = 'order-1002'"
        )
        .await
    );
}

#[tokio::test]
async fn sqlite_payment_callback_rejects_nonce_replay() {
    let pool = test_pool().await;
    let store = SqlitePaymentCallbackStore::new(pool.clone());
    seed_pending_recharge_payment(&pool, "order-1003", "payment-1003", "10.00", 100).await;

    store
        .process_payment_callback(success_command(
            "evt-1003-a",
            "nonce-1003",
            "order-1003",
            "txn-1003-a",
            Some("10.00"),
        ))
        .await
        .unwrap();

    let replay = store
        .process_payment_callback(success_command(
            "evt-1003-b",
            "nonce-1003",
            "order-1003",
            "txn-1003-b",
            Some("10.00"),
        ))
        .await
        .unwrap_err();

    assert!(replay.is_conflict());
    assert!(replay.to_string().contains("nonce replay"));
    assert_eq!(
        1100,
        scalar_i64(
            &pool,
            "SELECT CAST(available_amount AS INTEGER) FROM commerce_account WHERE owner_user_id = '30' AND asset_type = 'points'"
        )
        .await
    );
}

#[tokio::test]
async fn sqlite_payment_callback_rejects_amount_mismatch_and_marks_webhook_failed() {
    let pool = test_pool().await;
    let store = SqlitePaymentCallbackStore::new(pool.clone());
    seed_pending_recharge_payment(&pool, "order-1004", "payment-1004", "20.00", 200).await;

    let error = store
        .process_payment_callback(success_command(
            "evt-1004",
            "nonce-1004",
            "order-1004",
            "txn-1004",
            Some("19.99"),
        ))
        .await
        .unwrap_err();

    assert!(error.is_conflict());
    assert!(error.to_string().contains("amount does not match"));
    assert_eq!(
        "pending",
        scalar_string(
            &pool,
            "SELECT status FROM commerce_payment_attempt WHERE out_trade_no = 'order-1004'"
        )
        .await
    );
    assert_eq!(
        "pending",
        scalar_string(
            &pool,
            "SELECT status FROM commerce_payment_intent WHERE id = 'payment-1004'"
        )
        .await
    );
    assert_eq!(
        "pending_payment",
        scalar_string(
            &pool,
            "SELECT status FROM commerce_order WHERE id = 'order-entity-order-1004'"
        )
        .await
    );
    assert_eq!(
        "FAILED",
        scalar_string(
            &pool,
            "SELECT status FROM commerce_payment_webhook_event WHERE event_id = 'evt-1004'"
        )
        .await
    );
    assert_eq!(
        1000,
        scalar_i64(
            &pool,
            "SELECT CAST(available_amount AS INTEGER) FROM commerce_account WHERE owner_user_id = '30' AND asset_type = 'points'"
        )
        .await
    );
    assert_eq!(
        0,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM commerce_account_ledger_entry WHERE transaction_no = 'order-1004'"
        )
        .await
    );
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
        r#"CREATE TABLE commerce_payment_webhook_event (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            provider TEXT NOT NULL,
            event_id TEXT NOT NULL,
            nonce TEXT NOT NULL,
            signature TEXT,
            request_timestamp INTEGER,
            out_trade_no TEXT NOT NULL,
            transaction_id TEXT,
            payload_digest TEXT NOT NULL,
            status TEXT NOT NULL,
            message TEXT,
            request_no TEXT NOT NULL,
            idempotency_key TEXT NOT NULL,
            processed_at TEXT,
            UNIQUE (tenant_id, provider, event_id),
            UNIQUE (tenant_id, provider, nonce)
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
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_pending_recharge_payment(
    pool: &SqlitePool,
    out_trade_no: &str,
    payment_intent_id: &str,
    amount: &str,
    point_amount: i64,
) {
    let order_id = format!("order-entity-{out_trade_no}");
    sqlx::query(
        r#"
        INSERT INTO commerce_order
            (id, tenant_id, organization_id, owner_user_id, order_no, status, subject, currency_code, request_no, idempotency_key, created_at, paid_at, cancelled_at, expired_at, updated_at)
        VALUES
            (?, '10', '20', '30', ?, 'pending_payment', 'points_recharge', 'CNY', ?, ?, '2026-04-29 00:00:00', NULL, NULL, NULL, '2026-04-29 00:00:00')
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
            (?, '10', '20', '30', ?, 'stripe', ?, 'CNY', 'pending', ?, ?, '2026-04-29 00:00:00', '2026-04-29 00:00:00')
        "#,
    )
    .bind(payment_intent_id)
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
            (?, '10', '20', '30', ?, ?, 'stripe', ?, ?, 'CNY', 'pending', ?, '2026-04-29 00:00:00', NULL, '2026-04-29 00:00:00')
        "#,
    )
    .bind(format!("attempt-{out_trade_no}"))
    .bind(payment_intent_id)
    .bind(&order_id)
    .bind(out_trade_no)
    .bind(amount)
    .bind(format!(r#"{{"points":{point_amount}}}"#))
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO commerce_account
            (id, tenant_id, organization_id, owner_user_id, asset_type, currency_code, available_amount, frozen_amount, version, status, created_at, updated_at)
        VALUES
            ('account-30-points', '10', '20', '30', 'points', 'POINT', '1000', '0', 0, 'active', '2026-04-29 00:00:00', '2026-04-29 00:00:00')
        "#,
    )
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
        provider: 7,
        provider_key: "stripe".to_owned(),
        event_uuid: format!("{event_id}-uuid"),
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
