use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Vip purchase renew result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct VipPurchaseRenewResult {
    /// Business response code.
    pub code: String,

    /// Data field on vip purchase renew result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
