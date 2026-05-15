use serde::{Deserialize, Serialize};

/// Commerce coupon usage rollback request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCouponUsageRollbackRequest {
    /// Reason field on commerce coupon usage rollback request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,

    /// Request no field on commerce coupon usage rollback request.
    #[serde(rename = "requestNo")]
    pub request_no: String,

    /// Usage no field on commerce coupon usage rollback request.
    #[serde(rename = "usageNo")]
    pub usage_no: String,
}
