use serde::{Deserialize, Serialize};

use crate::models::{CommerceStandardResourceResponse};

/// Memberships plans create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MembershipsPlansCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on memberships plans create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceStandardResourceResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
