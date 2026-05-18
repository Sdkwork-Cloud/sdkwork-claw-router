use serde::{Deserialize, Serialize};

use crate::models::{AgentItem};

/// Agent list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentListResponse {
    /// Items field on agent list response.
    pub items: Vec<AgentItem>,
}
