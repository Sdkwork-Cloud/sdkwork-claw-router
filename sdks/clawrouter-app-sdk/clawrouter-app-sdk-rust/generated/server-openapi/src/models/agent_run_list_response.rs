use serde::{Deserialize, Serialize};

use crate::models::{AgentRunItem};

/// Agent run list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunListResponse {
    /// Items field on agent run list response.
    pub items: Vec<AgentRunItem>,
}
