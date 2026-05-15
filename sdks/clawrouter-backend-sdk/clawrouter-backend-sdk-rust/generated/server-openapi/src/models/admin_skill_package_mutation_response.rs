use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillPackageItem};

/// Admin skill package mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillPackageMutationResponse {
    /// Item field on admin skill package mutation response.
    pub item: AdminSkillPackageItem,
}
