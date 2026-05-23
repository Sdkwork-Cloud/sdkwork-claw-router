use sdkwork_commerce_core::{CommerceMoney, CommerceServiceError};
use sdkwork_commerce_promotion::{
    CouponClaimDraft, CouponDiscount, CouponRedemptionDraft, CouponStatus, CouponTemplateDraft,
    CouponTransition, PromotionPortRequirement, PromotionRepositoryCommand,
};

#[test]
fn validates_coupon_template_for_local_private_runtime() {
    let discount = CouponDiscount::fixed_amount(CommerceMoney::new("10.00").unwrap()).unwrap();
    let template =
        CouponTemplateDraft::new("tenant-1", "tpl-1", "New user coupon", discount).unwrap();

    assert_eq!(template.tenant_id, "tenant-1");
    assert_eq!(template.template_id, "tpl-1");
    assert_eq!(template.title, "New user coupon");
    assert!(CouponTemplateDraft::new(
        "tenant-1",
        "",
        "New user coupon",
        CouponDiscount::fixed_amount(CommerceMoney::new("10.00").unwrap()).unwrap(),
    )
    .is_err());
}

#[test]
fn validates_coupon_status_lifecycle() {
    assert_eq!(
        CouponTransition::new(CouponStatus::Draft, CouponStatus::Active).validate(),
        Ok(())
    );
    assert_eq!(
        CouponTransition::new(CouponStatus::Active, CouponStatus::Redeemed).validate(),
        Ok(()),
    );
    assert_eq!(
        CouponTransition::new(CouponStatus::Redeemed, CouponStatus::Active).validate(),
        Err(CommerceServiceError::invalid_state(
            "invalid coupon status transition"
        )),
    );
}

#[test]
fn coupon_claim_and_redemption_require_owner_and_idempotency() {
    let claim = CouponClaimDraft::new("tenant-1", "template-1", "user-1", "idem-claim-1").unwrap();
    let redemption =
        CouponRedemptionDraft::new("tenant-1", "coupon-1", "order-1", "user-1", "idem-redeem-1")
            .unwrap();

    assert_eq!(claim.owner_user_id, "user-1");
    assert_eq!(redemption.order_id, "order-1");
    assert!(CouponClaimDraft::new("tenant-1", "template-1", "", "idem-claim-1").is_err());
    assert!(CouponRedemptionDraft::new("tenant-1", "coupon-1", "order-1", "user-1", "").is_err());
}

#[test]
fn promotion_repository_contract_exposes_required_commands() {
    assert_eq!(
        PromotionPortRequirement::standard_commands(),
        vec![
            PromotionRepositoryCommand::CreateTemplate,
            PromotionRepositoryCommand::ClaimCoupon,
            PromotionRepositoryCommand::RedeemCoupon,
            PromotionRepositoryCommand::RollbackRedemption,
            PromotionRepositoryCommand::ExpireCoupon,
        ],
    );
}
