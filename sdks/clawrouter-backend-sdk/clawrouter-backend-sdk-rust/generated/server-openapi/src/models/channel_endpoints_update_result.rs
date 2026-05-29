use serde::{Deserialize, Serialize};

use crate::models::{AdminChannelEndpointMutationResponse};

/// Channel endpoints update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ChannelEndpointsUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on channel endpoints update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminChannelEndpointMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
