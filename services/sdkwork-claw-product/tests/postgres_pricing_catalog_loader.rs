use sdkwork_claw_product::infrastructure::sql::postgres::PostgresPricingCatalogLoader;
use sqlx::postgres::PgPoolOptions;

#[tokio::test]
async fn postgres_loader_can_be_constructed_without_connecting_for_server_deployments() {
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect_lazy("postgres://sdkwork:sdkwork@localhost:5432/sdkwork_claw_router")
        .unwrap();

    let _loader = PostgresPricingCatalogLoader::new(pool);
}
