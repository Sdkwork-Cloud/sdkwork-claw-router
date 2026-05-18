use serde::{Deserialize, Serialize};

use crate::models::{AgentItem};

/// Agent item response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentItemResponse {
    /// Item field on agent item response.
    pub item: AgentItem,
}
