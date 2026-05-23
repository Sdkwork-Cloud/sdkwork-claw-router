use axum::body::Body;
use axum::http::{Request, StatusCode};
use http_body_util::BodyExt;
use sdkwork_commerce_http::app_recharge_checkout_router_with_sqlite_pool;
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

async fn seed_recharge_data(pool: &SqlitePool) {
    for statement in [
        r#"
        INSERT INTO commerce_product_spu
            (id, tenant_id, organization_id, spu_no, title, product_type, sales_status, visible_surfaces, created_at, updated_at)
        VALUES
            ('product-owner', 'tenant-1', 'org-1', 'points-recharge-owner', 'Points recharge', 'points_recharge', 'active', '["app"]', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('product-tenant-20', 'tenant-1', NULL, 'points-recharge-tenant', 'Tenant points recharge', 'points_recharge', 'active', '["app"]', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('product-other-org', 'tenant-1', 'org-2', 'points-recharge-other', 'Other Org Recharge', 'points_recharge', 'active', '["app"]', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
        r#"
        INSERT INTO commerce_product_sku
            (id, tenant_id, organization_id, spu_id, sku_no, name, title, price_amount, currency_code, delivery_mode, inventory_tracking, sales_status, created_at, updated_at)
        VALUES
            ('sku-owner-10', 'tenant-1', 'org-1', 'product-owner', 'starter', 'Starter Pack', 'Starter Pack', '10.00', 'CNY', 'points_credit', 'untracked', 'active', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('sku-tenant-20', 'tenant-1', NULL, 'product-tenant-20', 'tenant-pack', 'Tenant Pack', 'Tenant Pack', '20.00', 'CNY', 'points_credit', 'untracked', 'active', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('sku-other-org-30', 'tenant-1', 'org-2', 'product-other-org', 'other-pack', 'Other Org Pack', 'Other Org Pack', '30.00', 'CNY', 'points_credit', 'untracked', 'active', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
        r#"
        INSERT INTO commerce_recharge_package
            (id, tenant_id, organization_id, external_id, package_no, sku_id, name, price_amount, currency_code, bonus_points, status, valid_from, valid_to, sort_weight, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('pack-owner-10', 'tenant-1', 'org-1', 1001, 'starter', 'sku-owner-10', 'Starter Pack', '10.00', 'CNY', 25, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 1, 'seed-pack-owner', 'seed-pack-owner', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('pack-tenant-20', 'tenant-1', NULL, 1002, 'tenant-pack', 'sku-tenant-20', 'Tenant Pack', '20.00', 'CNY', 50, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 2, 'seed-pack-tenant', 'seed-pack-tenant', '2026-05-20 00:00:00', '2026-05-20 00:00:00'),
            ('pack-other-org-30', 'tenant-1', 'org-2', 1002, 'other-pack', 'sku-other-org-30', 'Other Org Pack', '30.00', 'CNY', 75, 'active', '2026-01-01 00:00:00', '2099-01-01 00:00:00', 2, 'seed-pack-other', 'seed-pack-other', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
        r#"
        INSERT INTO commerce_payment_method
            (id, tenant_id, organization_id, method_key, display_name, provider, status, sort_weight, request_no, idempotency_key, created_at, updated_at)
        VALUES
            ('method-wechat', 'tenant-1', 'org-1', 'wechat', 'WeChat Pay', 'wechat', 'active', 1, 'seed-method-wechat', 'seed-method-wechat', '2026-05-20 00:00:00', '2026-05-20 00:00:00')
        "#,
    ] {
        sqlx::query(statement)
            .execute(pool)
            .await
            .expect("seed recharge data");
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
        .header("Idempotency-Key", "recharge-idem-1")
        .header("Sdkwork-Request-No", "recharge-request-1")
        .body(body)
        .expect("request")
}

async fn response_json(response: axum::response::Response) -> serde_json::Value {
    let body = response.into_body().collect().await.unwrap().to_bytes();
    serde_json::from_slice(&body).expect("json response")
}

#[tokio::test]
async fn app_recharge_router_lists_packages_from_sqlite_store() {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(subject_request(
            "GET",
            "/app/v3/api/recharges/packages",
            Body::empty(),
        ))
        .await
        .expect("packages response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(2, payload["data"].as_array().unwrap().len());
    assert_eq!("pack-owner-10", payload["data"][0]["id"]);
    assert_eq!("10.00", payload["data"][0]["rmb"]);
    assert_eq!(25, payload["data"][0]["bonus"]);
    assert_eq!(125, payload["data"][0]["points"]);
    assert_eq!("pack-tenant-20", payload["data"][1]["id"]);
    assert_eq!("20.00", payload["data"][1]["rmb"]);
    assert_eq!(50, payload["data"][1]["bonus"]);
    assert_eq!(250, payload["data"][1]["points"]);
}

#[tokio::test]
async fn app_recharge_router_creates_recharge_order_and_checkout_reads_status() {
    let pool = migrated_pool().await;
    seed_recharge_data(&pool).await;
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .clone()
        .oneshot(subject_request(
            "POST",
            "/app/v3/api/recharges/orders",
            Body::from(r#"{"amount":"10.00","method":"wechat"}"#),
        ))
        .await
        .expect("recharge response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(true, payload["data"]["success"]);
    assert_eq!("10.00", payload["data"]["amount"]);
    assert_eq!(125, payload["data"]["points"]);
    assert_eq!("wechat", payload["data"]["paymentMethod"]);
    assert_eq!("pending", payload["data"]["status"]);
    let order_no = payload["data"]["orderNo"]
        .as_str()
        .expect("orderNo")
        .to_owned();

    let response = app
        .oneshot(subject_request(
            "GET",
            &format!("/app/v3/api/recharges/orders/{order_no}"),
            Body::empty(),
        ))
        .await
        .expect("checkout response");

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(order_no, payload["data"]["orderNo"]);
    assert_eq!("10.00", payload["data"]["amount"]);
    assert_eq!(125, payload["data"]["points"]);
    assert_eq!("wechat", payload["data"]["paymentMethod"]);
    assert_eq!("pending", payload["data"]["status"]);
    assert_eq!("pending", payload["data"]["paymentStatus"]);
    assert_eq!("awaitPayment", payload["data"]["nextAction"]);
}

#[tokio::test]
async fn app_recharge_router_requires_subject_headers() {
    let pool = migrated_pool().await;
    let app = app_recharge_checkout_router_with_sqlite_pool(pool);

    let response = app
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/recharges/packages")
                .body(Body::empty())
                .expect("request"),
        )
        .await
        .expect("response");

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
}
