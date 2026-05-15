use serde::{Deserialize, Serialize};

/// Commerce coupon usage request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCouponUsageRequest {
    /// Amount field on commerce coupon usage request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub amount: Option<String>,

    /// Business no field on commerce coupon usage request.
    #[serde(rename = "businessNo")]
    pub business_no: String,

    /// Request no field on commerce coupon usage request.
    #[serde(rename = "requestNo")]
    pub request_no: String,

    /// User coupon id field on commerce coupon usage request.
    #[serde(rename = "userCouponId")]
    pub user_coupon_id: String,
}
