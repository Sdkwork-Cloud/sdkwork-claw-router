use sdkwork_commerce_core::{
    CommerceAccountAssetType, CommerceLedgerDirection, CommerceMoney, CommercePoints,
    CommerceRuntimeContext, validate_commerce_context,
};

#[test]
fn creates_commerce_runtime_context_from_verified_app_context() {
    let context = CommerceRuntimeContext::new(
        "tenant-1",
        Some("org-1"),
        "user-1",
        "session-1",
        "sdkwork-router",
        "private",
        "production",
    );

    assert_eq!(context.tenant_id, "tenant-1");
    assert_eq!(context.organization_id.as_deref(), Some("org-1"));
    assert_eq!(context.user_id, "user-1");
    assert_eq!(context.deployment_mode, "private");
    assert_eq!(context.environment, "production");
}

#[test]
fn validates_context_required_for_commerce_mutations() {
    let context = CommerceRuntimeContext::new(
        "tenant-1",
        None,
        "user-1",
        "session-1",
        "sdkwork-router",
        "local",
        "test",
    );

    assert!(validate_commerce_context(&context).is_ok());

    let invalid = CommerceRuntimeContext {
        tenant_id: String::new(),
        ..context
    };
    assert_eq!(
        validate_commerce_context(&invalid).unwrap_err(),
        "tenant id is required"
    );
}

#[test]
fn models_account_asset_and_ledger_amounts_with_explicit_precision() {
    assert_eq!(CommerceAccountAssetType::Cash.as_str(), "cash");
    assert_eq!(CommerceAccountAssetType::Points.as_str(), "points");
    assert_eq!(CommerceAccountAssetType::Token.as_str(), "token");
    assert_eq!(CommerceLedgerDirection::Credit.as_str(), "credit");
    assert_eq!(CommerceLedgerDirection::Debit.as_str(), "debit");

    assert!(CommerceMoney::new("19.99").is_ok());
    assert!(CommerceMoney::new("19.999").is_err());
    assert!(CommercePoints::new("1000").is_ok());
    assert!(CommercePoints::new("10.5").is_err());
}
