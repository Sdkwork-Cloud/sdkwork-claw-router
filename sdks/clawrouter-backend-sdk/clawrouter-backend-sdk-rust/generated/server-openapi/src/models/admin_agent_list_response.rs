use serde::{Deserialize, Serialize};

use crate::models::{AdminAgentItem};

/// Admin agent list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAgentListResponse {
    /// Items field on admin agent list response.
    pub items: Vec<AdminAgentItem>,
}
