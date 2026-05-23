use axum::body::Body;
use axum::http::{Request, StatusCode};
use http_body_util::BodyExt;
use sdkwork_commerce_http::{
    app_account_wallet_router_with_sqlite_pool, app_promotion_router_with_sqlite_pool,
};
use sqlx::SqlitePool;
use tower::ServiceExt;

async fn migrated_pool() -> SqlitePool {
    let pool = SqlitePool::connect("sqlite::memory:")
        .await
        .expect("sqlite pool");
    sqlx::query(sdkwork_commerce_storage_sqlx::commerce_initial_migration_sql())
        .execute(&pool)
        .await
        .expect("commerce migration");
    pool
}

async fn seed_redeem_template(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO commerce_coupon_template
            (id, tenant_id, organization_id, template_no, title, discount_type,
             discount_value, minimum_amount, total_quantity, claimed_quantity,
             redeemed_quantity, status, starts_at, expires_at, created_at, updated_at)
        VALUES
            ('template-welcome', 'tenant-1', 'org-1', 'WELCOME', 'Welcome points',
             'fixed_amount', '5.00', '0', 100, 0, 0, 'active',
             '2026-01-01 00:00:00', '2099-01-01 00:00:00',
             '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('template-other-org', 'tenant-1', 'org-2', 'WELCOME-OTHER', 'Other org points',
             'fixed_amount', '9.00', '0', 100, 0, 0, 'active',
             '2026-01-01 00:00:00', '2099-01-01 00:00:00',
             '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("seed redeem template");
}

async fn seed_token_account(pool: &SqlitePool) {
    sqlx::query(
        r#"
        INSERT INTO commerce_account
            (id, tenant_id, organization_id, owner_user_id, asset_type, currency_code,
             available_amount, frozen_amount, status, version, created_at, updated_at)
        VALUES
            ('token-account-1', 'tenant-1', 'org-1', 'user-1', 'token', NULL,
             '120', '8', 'active', 1, '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('token-account-other-org', 'tenant-1', 'org-2', 'user-1', 'token', NULL,
             '999', '0', 'active', 1, '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
    )
    .execute(pool)
    .await
    .expect("seed token account");
}

async fn seed_account_summary(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE iam_user (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            username TEXT,
            display_name TEXT,
            email TEXT,
            status TEXT
        )
        "#,
        r#"
        CREATE TABLE iam_organization (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            name TEXT,
            status TEXT
        )
        "#,
        r#"
        INSERT INTO iam_user
            (id, tenant_id, username, display_name, email, status)
        VALUES
            ('user-1', 'tenant-1', 'ada', 'Ada Lovelace', 'ada@example.test', 'active')
        "#,
        r#"
        INSERT INTO iam_organization
            (id, tenant_id, name, status)
        VALUES
            ('org-1', 'tenant-1', 'Research Console', 'active')
        "#,
        r#"
        INSERT INTO commerce_account
            (id, tenant_id, organization_id, owner_user_id, asset_type, currency_code,
             available_amount, frozen_amount, status, version, created_at, updated_at)
        VALUES
            ('points-account-1', 'tenant-1', 'org-1', 'user-1', 'points', NULL,
             '88', '0', 'active', 1, '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
    ] {
        sqlx::query(statement)
            .execute(pool)
            .await
            .expect("seed account summary");
    }
}

fn subject_request(method: &str, uri: &str, body: Body) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header("content-type", "application/json")
        .header("x-sdkwork-tenant-id", "tenant-1")
        .header("x-sdkwork-organization-id", "org-1")
        .header("x-sdkwork-user-id", "user-1")
        .header("Idempotency-Key", "redeem-idem-1")
        .header("Sdkwork-Request-No", "redeem-request-1")
        .body(body)
        .expect("request")
}

async fn response_json(response: axum::response::Response) -> serde_json::Value {
    let body = response.into_body().collect().await.unwrap().to_bytes();
    serde_json::from_slice(&body).expect("json response")
}

#[tokio::test]
async fn app_account_wallet_router_exposes_account_summary_from_appbase_store() {
    let pool = migrated_pool().await;
    seed_account_summary(&pool).await;
    let app = app_account_wallet_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/accounts/current/summary",
            Body::empty(),
        ))
        .await
        .expect("account summary response");

    assert_eq!(response.status(), StatusCode::OK);
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("user-1", payload["data"]["id"]);
    assert_eq!("Ada Lovelace", payload["data"]["name"]);
    assert_eq!("ada@example.test", payload["data"]["email"]);
    assert_eq!("Research Console", payload["data"]["organization"]);
    assert_eq!(88.0, payload["data"]["availableCredits"]);
    assert_eq!(0.0, payload["data"]["monthlyConsumption"]);
    assert!(payload["data"]["consumptionByService"]
        .as_array()
        .unwrap()
        .is_empty());
}

#[tokio::test]
async fn app_promotion_router_redeems_code_and_exposes_points_and_coupon_history() {
    let pool = migrated_pool().await;
    seed_redeem_template(&pool).await;
    let app = app_promotion_router_with_sqlite_pool(pool);

    let response = app
        .clone()
        .oneshot(subject_request(
            "POST",
            "/app/v3/api/coupons/redemptions",
            Body::from(r#"{"code":"WELCOME"}"#),
        ))
        .await
        .expect("redeem response");

    assert_eq!(response.status(), StatusCode::OK);
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!("Redeem code applied", payload["data"]["message"]);
    assert_eq!("5.00", payload["data"]["amount"]);
    assert_eq!(50, payload["data"]["creditedPoints"]);
    assert_eq!(50, payload["data"]["balance"]);

    let response = app
        .clone()
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/wallet/points",
            Body::empty(),
        ))
        .await
        .expect("points response");
    assert_eq!(response.status(), StatusCode::OK);
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(50, payload["data"]["availablePoints"]);
    assert_eq!(0, payload["data"]["frozenPoints"]);

    let response = app
        .clone()
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/wallet/points/history",
            Body::empty(),
        ))
        .await
        .expect("points history response");
    assert_eq!(response.status(), StatusCode::OK);
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(1, payload["data"].as_array().unwrap().len());
    assert_eq!(50, payload["data"][0]["amount"]);
    assert_eq!("in", payload["data"][0]["direction"]);
    assert_eq!("redeem", payload["data"][0]["businessType"]);
    assert_eq!(50, payload["data"][0]["balanceAfter"]);

    let response = app
        .oneshot(subject_request("GET", "/app/v3/api/coupons", Body::empty()))
        .await
        .expect("coupon history response");
    assert_eq!(response.status(), StatusCode::OK);
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(1, payload["data"].as_array().unwrap().len());
    assert_eq!("5.00", payload["data"][0]["amount"]);
    assert_eq!("success", payload["data"][0]["status"]);
}

#[tokio::test]
async fn app_promotion_router_requires_subject_headers_for_points_reads() {
    let pool = migrated_pool().await;
    let app = app_promotion_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/wallet/points")
                .body(Body::empty())
                .expect("request"),
        )
        .await
        .expect("response");

    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
}

#[tokio::test]
async fn app_account_wallet_router_exposes_token_balance_from_standard_account_table() {
    let pool = migrated_pool().await;
    seed_token_account(&pool).await;
    let app = app_account_wallet_router_with_sqlite_pool(pool);

    let response = app
        .clone()
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/wallet/tokens",
            Body::empty(),
        ))
        .await
        .expect("token balance response");

    assert_eq!(response.status(), StatusCode::OK);
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(120, payload["data"]["availableTokens"]);
    assert_eq!(8, payload["data"]["frozenTokens"]);

    let response = app
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/wallet/tokens")
                .body(Body::empty())
                .expect("request"),
        )
        .await
        .expect("missing subject response");
    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
}

#[tokio::test]
async fn app_account_wallet_router_does_not_register_retired_token_deduction_route() {
    let pool = migrated_pool().await;
    let app = app_account_wallet_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "POST",
            "/app/v3/api/wallet/tokens/deductions",
            Body::from("{}"),
        ))
        .await
        .expect("token deductions response");

    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}
