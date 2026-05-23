use serde::{Deserialize, Serialize};

use crate::models::{BillingRedeemHistoryItem};

/// Users current coupons retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UsersCurrentCouponsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on users current coupons retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<BillingRedeemHistoryItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
