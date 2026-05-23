use serde::{Deserialize, Serialize};

use crate::models::{CommerceStandardResourceResponse};

/// Refunds retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundsRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on refunds retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceStandardResourceResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
