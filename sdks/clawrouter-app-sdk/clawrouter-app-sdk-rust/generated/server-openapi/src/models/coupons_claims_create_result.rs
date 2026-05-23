use serde::{Deserialize, Serialize};

use crate::models::{BillingRedeemHistoryItem};

/// Coupons claims create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CouponsClaimsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on coupons claims create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<BillingRedeemHistoryItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
