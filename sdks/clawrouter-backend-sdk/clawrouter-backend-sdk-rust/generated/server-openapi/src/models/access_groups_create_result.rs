use serde::{Deserialize, Serialize};

use crate::models::{AdminAccessGroupMutationResponse};

/// Access groups create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccessGroupsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on access groups create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAccessGroupMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
