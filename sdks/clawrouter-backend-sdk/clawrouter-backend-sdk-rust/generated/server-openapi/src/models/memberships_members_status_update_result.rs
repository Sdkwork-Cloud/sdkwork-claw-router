use serde::{Deserialize, Serialize};

use crate::models::{CommerceStandardResourceResponse};

/// Memberships members status update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MembershipsMembersStatusUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on memberships members status update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceStandardResourceResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
