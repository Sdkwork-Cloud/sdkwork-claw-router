use crate::{
    CouponClaimDraft, CouponRedemptionDraft, CurrentUserCouponItem, CurrentUserCouponListQuery,
    PointsBalance, PointsBalanceQuery, PointsHistoryItem, PointsHistoryQuery, RedeemCodeCommand,
    RedeemCodeOutcome,
};
use sdkwork_commerce_core::CommerceServiceError;

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PromotionRepositoryCommand {
    CreateTemplate,
    ClaimCoupon,
    RedeemCoupon,
    RollbackRedemption,
    ExpireCoupon,
}

pub struct PromotionPortRequirement;

pub trait PromotionRepositoryPort {
    fn claim_coupon(&self, draft: &CouponClaimDraft) -> Result<(), CommerceServiceError>;

    fn redeem_coupon(&self, draft: &CouponRedemptionDraft) -> Result<(), CommerceServiceError>;
}

pub trait PromotionApplicationPort {
    fn list_current_user_coupons(
        &self,
        query: CurrentUserCouponListQuery,
    ) -> Result<Vec<CurrentUserCouponItem>, CommerceServiceError>;

    fn retrieve_points_balance(
        &self,
        query: PointsBalanceQuery,
    ) -> Result<PointsBalance, CommerceServiceError>;

    fn list_points_history(
        &self,
        query: PointsHistoryQuery,
    ) -> Result<Vec<PointsHistoryItem>, CommerceServiceError>;

    fn redeem_code(
        &self,
        command: RedeemCodeCommand,
    ) -> Result<RedeemCodeOutcome, CommerceServiceError>;
}

pub const PROMOTION_REPOSITORY_PORT: &str = "promotion.repository";
pub const PROMOTION_APPLICATION_PORT: &str = "promotion.application";
pub const IDEMPOTENCY_REPOSITORY_PORT: &str = "idempotency.repository";

impl PromotionPortRequirement {
    pub fn standard_commands() -> Vec<PromotionRepositoryCommand> {
        vec![
            PromotionRepositoryCommand::CreateTemplate,
            PromotionRepositoryCommand::ClaimCoupon,
            PromotionRepositoryCommand::RedeemCoupon,
            PromotionRepositoryCommand::RollbackRedemption,
            PromotionRepositoryCommand::ExpireCoupon,
        ]
    }
}
