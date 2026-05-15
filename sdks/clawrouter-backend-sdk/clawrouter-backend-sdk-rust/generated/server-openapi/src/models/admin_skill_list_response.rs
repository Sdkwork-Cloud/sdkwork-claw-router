use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillItem};

/// Admin skill list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillListResponse {
    /// Agent skill snapshots returned by the backend.
    pub items: Vec<AdminSkillItem>,
}
