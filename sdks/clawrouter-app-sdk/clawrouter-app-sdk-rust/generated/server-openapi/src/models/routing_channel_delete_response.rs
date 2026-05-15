use serde::{Deserialize, Serialize};

/// Routing channel delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingChannelDeleteResponse {
    /// Deleted field on routing channel delete response.
    pub deleted: bool,
}
