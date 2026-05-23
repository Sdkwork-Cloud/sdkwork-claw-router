use serde::{Deserialize, Serialize};

use crate::models::{AgentRunStepItem};

/// Agent run step list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunStepListResponse {
    /// Items field on agent run step list response.
    pub items: Vec<AgentRunStepItem>,
}
