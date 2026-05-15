use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillPackageItem};

/// Admin skill package list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillPackageListResponse {
    /// Skill package snapshots returned by the backend.
    pub items: Vec<AdminSkillPackageItem>,
}
