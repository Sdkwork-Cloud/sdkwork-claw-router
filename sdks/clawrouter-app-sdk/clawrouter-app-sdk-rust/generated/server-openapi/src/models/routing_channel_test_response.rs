use serde::{Deserialize, Serialize};

use crate::models::{RoutingChannelItem};

/// Routing channel test response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingChannelTestResponse {
    /// Channel id field on routing channel test response.
    #[serde(rename = "channelId")]
    pub channel_id: String,

    /// Item field on routing channel test response.
    pub item: RoutingChannelItem,

    /// Latency field on routing channel test response.
    pub latency: String,

    /// Status field on routing channel test response.
    pub status: String,

    /// Success field on routing channel test response.
    pub success: bool,
}
