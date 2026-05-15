use sdkwork_commerce_http::{
    APP_API_PREFIX, CommerceHttpRoute, HttpMethod, app_routes, required_dual_token_headers,
};

#[test]
fn exposes_standard_app_prefix_and_dual_token_headers() {
    assert_eq!(APP_API_PREFIX, "/app/v3/api");
    assert_eq!(
        required_dual_token_headers(),
        ["Authorization", "Sdkwork-Access-Token"]
    );
}

#[test]
fn exposes_billing_routes_for_wallet_points_vip_and_preflight() {
    let routes = app_routes();

    assert!(routes.contains(&CommerceHttpRoute::new(
        HttpMethod::Get,
        "/app/v3/api/billing/wallet/overview",
        "billing",
        "wallet.overview.retrieve",
    )));
    assert!(routes.contains(&CommerceHttpRoute::new(
        HttpMethod::Post,
        "/app/v3/api/billing/account/points/recharges",
        "billing",
        "account.points.recharge.create",
    )));
    assert!(routes.contains(&CommerceHttpRoute::new(
        HttpMethod::Post,
        "/app/v3/api/billing/vip/purchase/upgrade",
        "billing",
        "vip.purchase.upgrade",
    )));
    assert!(routes.contains(&CommerceHttpRoute::new(
        HttpMethod::Post,
        "/app/v3/api/billing/preflight/preholds",
        "billing",
        "preflight.preholds.create",
    )));
}

#[test]
fn route_manifest_uses_sdkwork_v3_naming_rules() {
    let operation_ids: Vec<&str> = app_routes()
        .iter()
        .map(|route| route.operation_id)
        .collect();

    assert_eq!(operation_ids.len(), 35);
    assert!(operation_ids.contains(&"account.summary.retrieve"));
    assert!(operation_ids.contains(&"vip.points.dailyRewards.status.retrieve"));

    for route in app_routes() {
        assert!(route.path.starts_with("/app/v3/api/billing/"));
        assert!(!route.path.contains("__"));
        assert!(!route.path.contains("/vip/purchase"));
        assert!(!route.path.contains("/account/points/recharge"));
        assert!(!route.operation_id.starts_with("billing."));
        assert!(!route.operation_id.contains('_'));
        assert!(route.operation_id.contains('.'));
    }
}
