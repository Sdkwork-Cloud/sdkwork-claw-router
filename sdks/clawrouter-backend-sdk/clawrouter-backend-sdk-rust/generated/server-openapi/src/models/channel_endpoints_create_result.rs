use serde::{Deserialize, Serialize};

use crate::models::{AdminChannelEndpointMutationResponse};

/// Channel endpoints create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ChannelEndpointsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on channel endpoints create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<AdminChannelEndpointMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
