use serde::{Deserialize, Serialize};

use crate::models::{AdminChannelEndpointItem};

/// Admin channel endpoints response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelEndpointsResponse {
    /// Items field on admin channel endpoints response.
    pub items: Vec<AdminChannelEndpointItem>,
}
