use serde::{Deserialize, Serialize};

use crate::models::{AgentRunItem};

/// Agent run response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunResponse {
    /// Item field on agent run response.
    pub item: AgentRunItem,
}
