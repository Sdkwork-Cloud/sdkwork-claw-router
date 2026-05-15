use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_test_support::seeded_sqlite_catalog;
use tower::ServiceExt;

#[tokio::test]
async fn sqlite_product_catalog_route_serves_real_backend_model_list() {
    let catalog = seeded_sqlite_catalog().await.unwrap();
    let pool = catalog.open_pool().await.unwrap();

    let router = sdkwork_claw_admin_api::router_with_sqlite_product_catalog(pool)
        .await
        .unwrap();
    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/ai/models?api_key_id=100&billing_meter=llm_input_token&vendor_code=openai")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let payload: serde_json::Value = serde_json::from_slice(&body).unwrap();

    assert_eq!("2000", payload["code"]);
    assert_eq!("gpt-4o-mini", payload["data"]["items"][0]["model"]);
    assert_eq!(
        "0.198000",
        payload["data"]["items"][0]["priceAvailability"]["customerUnitPrice"]
    );
}
