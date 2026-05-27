use serde::{Deserialize, Serialize};

use crate::models::{AdminAccessGroupChannelBindingsResponse};

/// Access groups channel bindings list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccessGroupsChannelBindingsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on access groups channel bindings list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminAccessGroupChannelBindingsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
