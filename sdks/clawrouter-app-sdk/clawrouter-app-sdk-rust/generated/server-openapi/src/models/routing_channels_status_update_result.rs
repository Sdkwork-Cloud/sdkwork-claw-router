use serde::{Deserialize, Serialize};

use crate::models::{RoutingChannelMutationResponse};

/// Routing channels status update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingChannelsStatusUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on routing channels status update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<RoutingChannelMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
