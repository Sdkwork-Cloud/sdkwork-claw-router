use serde::{Deserialize, Serialize};

use crate::models::{RoutingChannelDeleteResponse};

/// Routing channels delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingChannelsDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on routing channels delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<RoutingChannelDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
