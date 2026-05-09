use sdkwork_claw_product::infrastructure::sql::sqlite::SqlitePaymentCallbackStore;
use sdkwork_claw_product::ports::{
    PaymentCallbackCommand, PaymentCallbackStatus, PaymentCallbackStore,
};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};

#[tokio::test]
async fn sqlite_payment_callback_fulfills_recharge_once_and_records_webhook_success() {
    let pool = test_pool().await;
    let store = SqlitePaymentCallbackStore::new(pool.clone());
    seed_pending_recharge_payment(&pool, "order-1001", 88.50, 880).await;

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
        2,
        scalar_i64(
            &pool,
            "SELECT status FROM plus_payment WHERE out_trade_no = 'order-1001'"
        )
        .await
    );
    assert_eq!(
        2,
        scalar_i64(&pool, "SELECT status FROM plus_order WHERE id = 100").await
    );
    assert_eq!(
        1,
        scalar_i64(
            &pool,
            "SELECT status FROM plus_vip_recharge WHERE transaction_no = 'order-1001'"
        )
        .await
    );
    assert_eq!(
        1880,
        scalar_i64(
            &pool,
            "SELECT available_points FROM plus_account WHERE user_id = 30 AND account_type = 2"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM plus_account_history WHERE transaction_id = 'order-1001'"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM plus_vip_point_change WHERE source_type = 'PURCHASE'"
        )
        .await
    );
    assert_eq!(
        "SUCCESS",
        scalar_string(
            &pool,
            "SELECT status FROM plus_payment_webhook_event WHERE event_id = 'evt-1001'"
        )
        .await
    );
}

#[tokio::test]
async fn sqlite_payment_callback_duplicate_event_does_not_credit_twice() {
    let pool = test_pool().await;
    let store = SqlitePaymentCallbackStore::new(pool.clone());
    seed_pending_recharge_payment(&pool, "order-1002", 30.00, 300).await;

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
            "SELECT available_points FROM plus_account WHERE user_id = 30 AND account_type = 2"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM plus_account_history WHERE transaction_id = 'order-1002'"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM plus_vip_point_change WHERE source_type = 'PURCHASE'"
        )
        .await
    );
}

#[tokio::test]
async fn sqlite_payment_callback_rejects_nonce_replay() {
    let pool = test_pool().await;
    let store = SqlitePaymentCallbackStore::new(pool.clone());
    seed_pending_recharge_payment(&pool, "order-1003", 10.00, 100).await;

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
            "SELECT available_points FROM plus_account WHERE user_id = 30 AND account_type = 2"
        )
        .await
    );
}

#[tokio::test]
async fn sqlite_payment_callback_rejects_amount_mismatch_and_marks_webhook_failed() {
    let pool = test_pool().await;
    let store = SqlitePaymentCallbackStore::new(pool.clone());
    seed_pending_recharge_payment(&pool, "order-1004", 20.00, 200).await;

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
        1,
        scalar_i64(
            &pool,
            "SELECT status FROM plus_payment WHERE out_trade_no = 'order-1004'"
        )
        .await
    );
    assert_eq!(
        1,
        scalar_i64(&pool, "SELECT status FROM plus_order WHERE id = 100").await
    );
    assert_eq!(
        3,
        scalar_i64(
            &pool,
            "SELECT status FROM plus_vip_recharge WHERE transaction_no = 'order-1004'"
        )
        .await
    );
    assert_eq!(
        "FAILED",
        scalar_string(
            &pool,
            "SELECT status FROM plus_payment_webhook_event WHERE event_id = 'evt-1004'"
        )
        .await
    );
    assert_eq!(
        1000,
        scalar_i64(
            &pool,
            "SELECT available_points FROM plus_account WHERE user_id = 30 AND account_type = 2"
        )
        .await
    );
    assert_eq!(
        0,
        scalar_i64(
            &pool,
            "SELECT COUNT(1) FROM plus_account_history WHERE transaction_id = 'order-1004'"
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
        r#"CREATE TABLE plus_payment_webhook_event (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
            provider INTEGER NOT NULL,
            event_id TEXT NOT NULL,
            nonce TEXT NOT NULL,
            signature TEXT,
            request_timestamp INTEGER,
            out_trade_no TEXT NOT NULL,
            transaction_id TEXT,
            payload_digest TEXT NOT NULL,
            status TEXT NOT NULL,
            message TEXT,
            processed_at TEXT
        )"#,
        r#"CREATE TABLE plus_order (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            status INTEGER NOT NULL,
            total_amount REAL NOT NULL,
            paid_amount REAL NOT NULL DEFAULT 0,
            transaction_id TEXT,
            pay_success_time TEXT,
            cancel_time TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE plus_payment (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            order_id INTEGER NOT NULL,
            provider INTEGER NOT NULL,
            out_trade_no TEXT NOT NULL,
            amount REAL NOT NULL,
            status INTEGER NOT NULL,
            purpose TEXT NOT NULL,
            transaction_id TEXT,
            success_time TEXT,
            updated_at TEXT
        )"#,
        r#"CREATE TABLE plus_vip_recharge (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            transaction_no TEXT NOT NULL,
            status INTEGER NOT NULL,
            point_amount INTEGER NOT NULL,
            recharge_time TEXT,
            updated_at TEXT,
            remark TEXT
        )"#,
        r#"CREATE TABLE plus_account (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            account_type INTEGER NOT NULL,
            owner INTEGER NOT NULL,
            owner_id INTEGER NOT NULL,
            available_balance REAL NOT NULL,
            frozen_balance REAL NOT NULL,
            available_points INTEGER NOT NULL,
            frozen_points INTEGER NOT NULL,
            token_balance INTEGER NOT NULL,
            frozen_token INTEGER NOT NULL,
            status INTEGER NOT NULL
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
            account_type INTEGER NOT NULL,
            asset_type INTEGER NOT NULL,
            account_id INTEGER NOT NULL,
            transaction_id TEXT NOT NULL,
            transaction_type INTEGER NOT NULL,
            points_change INTEGER NOT NULL,
            points_before INTEGER NOT NULL,
            points_after INTEGER NOT NULL,
            source_type INTEGER NOT NULL,
            source_id TEXT NOT NULL,
            status INTEGER NOT NULL,
            usage_result TEXT,
            remarks TEXT
        )"#,
        r#"CREATE TABLE plus_vip_point_change (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            v INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            change_type INTEGER NOT NULL,
            change_amount INTEGER NOT NULL,
            before_balance INTEGER NOT NULL,
            after_balance INTEGER NOT NULL,
            source_id INTEGER NOT NULL,
            source_type TEXT NOT NULL,
            remark TEXT
        )"#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_pending_recharge_payment(
    pool: &SqlitePool,
    out_trade_no: &str,
    amount: f64,
    point_amount: i64,
) {
    sqlx::query(
        "INSERT INTO plus_order (id, tenant_id, organization_id, user_id, status, total_amount, paid_amount) VALUES (100, 10, 20, 30, 1, ?, 0)",
    )
    .bind(amount)
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        "INSERT INTO plus_payment (id, tenant_id, organization_id, order_id, provider, out_trade_no, amount, status, purpose) VALUES (200, 10, 20, 100, 7, ?, ?, 1, 'POINTS')",
    )
    .bind(out_trade_no)
    .bind(amount)
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        "INSERT INTO plus_vip_recharge (id, tenant_id, organization_id, user_id, transaction_no, status, point_amount) VALUES (300, 10, 20, 30, ?, 3, ?)",
    )
    .bind(out_trade_no)
    .bind(point_amount)
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        "INSERT INTO plus_account (id, uuid, tenant_id, organization_id, data_scope, created_at, updated_at, v, user_id, account_type, owner, owner_id, available_balance, frozen_balance, available_points, frozen_points, token_balance, frozen_token, status) VALUES (400, 'account-400', 10, 20, 1, '2026-04-29 00:00:00', '2026-04-29 00:00:00', 0, 30, 2, 0, 30, 0, 0, 1000, 0, 0, 0, 1)",
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
        point_change_uuid: format!("{event_id}-point-change"),
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
