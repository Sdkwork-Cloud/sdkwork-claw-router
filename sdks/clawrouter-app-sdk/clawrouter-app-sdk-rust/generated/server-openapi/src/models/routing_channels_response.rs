use serde::{Deserialize, Serialize};

/// Routing channels response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingChannelsResponse {
    /// Items field on routing channels response.
    pub items: Vec<serde_json::Value>,
}
