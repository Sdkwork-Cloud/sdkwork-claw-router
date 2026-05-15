use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillArtifactItem};

/// Admin skill artifact mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillArtifactMutationResponse {
    /// Item field on admin skill artifact mutation response.
    pub item: AdminSkillArtifactItem,
}
