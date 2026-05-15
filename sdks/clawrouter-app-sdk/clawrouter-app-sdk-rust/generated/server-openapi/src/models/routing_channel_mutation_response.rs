use serde::{Deserialize, Serialize};

use crate::models::{RoutingChannelItem};

/// Routing channel mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RoutingChannelMutationResponse {
    /// Item field on routing channel mutation response.
    pub item: RoutingChannelItem,
}
