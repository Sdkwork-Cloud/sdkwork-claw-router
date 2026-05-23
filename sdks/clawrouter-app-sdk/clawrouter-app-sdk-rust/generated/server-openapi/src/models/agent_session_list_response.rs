use serde::{Deserialize, Serialize};

use crate::models::{AgentSessionItem};

/// Agent session list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentSessionListResponse {
    /// Items field on agent session list response.
    pub items: Vec<AgentSessionItem>,
}
