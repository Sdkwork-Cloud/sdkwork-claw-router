use serde::{Deserialize, Serialize};

/// Commerce coupon claim request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCouponClaimRequest {
    /// Claim source field on commerce coupon claim request.
    #[serde(rename = "claimSource")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim_source: Option<String>,

    /// Coupon id field on commerce coupon claim request.
    #[serde(rename = "couponId")]
    pub coupon_id: String,
}
