use serde::{Deserialize, Serialize};

/// Admin skill package delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillPackageDeleteResponse {
    /// Whether the skill package was deleted.
    pub deleted: bool,
}
