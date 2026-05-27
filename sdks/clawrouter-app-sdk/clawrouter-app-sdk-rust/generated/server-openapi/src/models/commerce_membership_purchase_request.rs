use serde::{Deserialize, Serialize};

/// Commerce membership purchase request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipPurchaseRequest {
    /// Coupon id field on commerce membership purchase request.
    #[serde(rename = "couponId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub coupon_id: Option<String>,

    /// Package id field on commerce membership purchase request.
    #[serde(rename = "packageId")]
    pub package_id: i64,

    /// Payment method field on commerce membership purchase request.
    #[serde(rename = "paymentMethod")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_method: Option<String>,
}
