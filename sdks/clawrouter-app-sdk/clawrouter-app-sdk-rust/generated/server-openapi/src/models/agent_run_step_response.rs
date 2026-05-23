use serde::{Deserialize, Serialize};

use crate::models::{AgentRunStepItem};

/// Agent run step response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunStepResponse {
    /// Item field on agent run step response.
    pub item: AgentRunStepItem,
}
