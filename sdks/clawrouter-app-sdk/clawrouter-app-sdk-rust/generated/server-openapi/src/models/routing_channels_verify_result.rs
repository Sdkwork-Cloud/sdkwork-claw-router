use serde::{Deserialize, Serialize};

use crate::models::{RoutingChannelTestResponse};

/// Routing channels verify result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingChannelsVerifyResult {
    /// Business response code.
    pub code: String,

    /// Data field on routing channels verify result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<RoutingChannelTestResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
