use serde::{Deserialize, Serialize};

/// Set routing channel status request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SetRoutingChannelStatusRequest {
    /// Status field on set routing channel status request.
    pub status: String,
}
