use serde::{Deserialize, Serialize};

use crate::models::{AgentSessionItem};

/// Agent session response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentSessionResponse {
    /// Item field on agent session response.
    pub item: AgentSessionItem,
}
