use serde::{Deserialize, Serialize};

use crate::models::{AdminChannelEndpointsResponse};

/// Channel endpoints list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ChannelEndpointsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on channel endpoints list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminChannelEndpointsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
