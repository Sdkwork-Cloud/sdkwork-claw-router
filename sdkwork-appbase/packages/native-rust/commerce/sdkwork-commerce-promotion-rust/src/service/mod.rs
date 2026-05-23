use sdkwork_commerce_core::CommerceServiceContract;

pub fn promotion_service_contract() -> CommerceServiceContract {
    CommerceServiceContract::new(
        "promotion",
        "commerce.promotion",
        vec!["coupons.claims.create", "coupons.redemptions.create"],
        vec![
            "coupons.list",
            "wallet.exchangeRate.retrieve",
            "wallet.points.exchangeRules.list",
            "coupons.templates.list",
            "coupons.campaigns.list",
            "coupons.codes.list",
            "coupons.redemptions.list",
        ],
        vec![
            crate::ports::PROMOTION_APPLICATION_PORT,
            crate::ports::PROMOTION_REPOSITORY_PORT,
            crate::ports::IDEMPOTENCY_REPOSITORY_PORT,
        ],
        true,
    )
}
