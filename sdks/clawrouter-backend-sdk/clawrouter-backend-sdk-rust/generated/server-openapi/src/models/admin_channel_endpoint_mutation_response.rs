use serde::{Deserialize, Serialize};

use crate::models::{AdminChannelEndpointItem};

/// Admin channel endpoint mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminChannelEndpointMutationResponse {
    /// Item field on admin channel endpoint mutation response.
    pub item: AdminChannelEndpointItem,
}
