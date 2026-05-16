use std::sync::Arc;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::ports::{
    AppCommerceExchangeReadFuture, AppCommerceExchangeReadStore, AppCommerceExchangeRuleItem,
    AppCommerceExchangeRuleQuery, AppCommerceSubject,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn app_commerce_reads_points_exchange_rate_and_rules_from_store() {
    let router = sdkwork_claw_product::api::app_commerce_foundation_router_with_exchange_store(
        Arc::new(TestAppCommerceExchangeStore),
    );

    let exchange_rate = request_json(
        router.clone(),
        signed_request("GET", "/app/v3/api/billing/account/points/exchange_rate"),
    )
    .await;
    assert_eq!("2000", exchange_rate["code"]);
    assert_eq!("POINTS", exchange_rate["data"]["sourceAssetType"]);
    assert_eq!("CASH", exchange_rate["data"]["targetAssetType"]);
    assert_eq!("120", exchange_rate["data"]["rate"]);

    let rules = request_json(
        router,
        signed_request(
            "GET",
            "/app/v3/api/billing/account/points/exchanges/rules?source_asset_type=points&target_asset_type=cash",
        ),
    )
    .await;
    assert_eq!("2000", rules["code"]);
    assert_eq!("exchange-1", rules["data"][0]["id"]);
    assert_eq!("POINTS", rules["data"][0]["sourceAssetType"]);
    assert_eq!("CASH", rules["data"][0]["targetAssetType"]);
    assert_eq!("120", rules["data"][0]["rate"]);
    assert_eq!("active", rules["data"][0]["status"]);
}

fn signed_request(method: &str, path: &str) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(path)
        .header("x-sdkwork-tenant-id", "10")
        .header("x-sdkwork-organization-id", "20")
        .header("x-sdkwork-user-id", "30")
        .body(Body::empty())
        .unwrap()
}

async fn request_json(router: axum::Router, request: Request<Body>) -> Value {
    let response = router.oneshot(request).await.unwrap();
    assert_eq!(StatusCode::OK, response.status());
    json_payload(response).await
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

struct TestAppCommerceExchangeStore;

impl AppCommerceExchangeReadStore for TestAppCommerceExchangeStore {
    fn list_exchange_rules<'a>(
        &'a self,
        query: AppCommerceExchangeRuleQuery,
    ) -> AppCommerceExchangeReadFuture<'a, Vec<AppCommerceExchangeRuleItem>> {
        Box::pin(async move {
            assert_eq!(
                Some(AppCommerceSubject {
                    tenant_id: 10,
                    organization_id: 20,
                    user_id: 30,
                }),
                query.subject
            );
            assert_eq!(Some("POINTS".to_owned()), query.source_asset_type);
            assert_eq!(Some("CASH".to_owned()), query.target_asset_type);
            Ok(vec![AppCommerceExchangeRuleItem {
                id: "exchange-1".to_owned(),
                source_asset_type: "POINTS".to_owned(),
                target_asset_type: "CASH".to_owned(),
                rate: "120".to_owned(),
                status: "active".to_owned(),
            }])
        })
    }

    fn load_points_exchange_rate<'a>(
        &'a self,
        subject: Option<AppCommerceSubject>,
    ) -> AppCommerceExchangeReadFuture<'a, Option<AppCommerceExchangeRuleItem>> {
        Box::pin(async move {
            assert_eq!(
                Some(AppCommerceSubject {
                    tenant_id: 10,
                    organization_id: 20,
                    user_id: 30,
                }),
                subject
            );
            Ok(Some(AppCommerceExchangeRuleItem {
                id: "exchange-1".to_owned(),
                source_asset_type: "POINTS".to_owned(),
                target_asset_type: "CASH".to_owned(),
                rate: "120".to_owned(),
                status: "active".to_owned(),
            }))
        })
    }
}
