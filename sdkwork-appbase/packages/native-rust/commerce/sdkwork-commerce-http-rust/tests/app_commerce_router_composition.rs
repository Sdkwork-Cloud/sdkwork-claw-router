use sdkwork_commerce_http::{
    app_account_wallet_router_with_sqlite_pool, app_commerce_foundation_router_with_sqlite_pool,
    app_promotion_router_with_sqlite_pool, app_recharge_checkout_router_with_sqlite_pool,
};
use sqlx::SqlitePool;

#[tokio::test]
async fn appbase_commerce_app_routers_compose_without_overlapping_method_routes() {
    let pool = SqlitePool::connect("sqlite::memory:")
        .await
        .expect("sqlite pool");

    let _router = app_commerce_foundation_router_with_sqlite_pool(pool.clone())
        .merge(app_account_wallet_router_with_sqlite_pool(pool.clone()))
        .merge(app_promotion_router_with_sqlite_pool(pool.clone()))
        .merge(app_recharge_checkout_router_with_sqlite_pool(pool));
}
