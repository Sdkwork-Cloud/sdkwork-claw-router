use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillAssetItem};

/// Admin skill asset mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillAssetMutationResponse {
    /// Item field on admin skill asset mutation response.
    pub item: AdminSkillAssetItem,
}
