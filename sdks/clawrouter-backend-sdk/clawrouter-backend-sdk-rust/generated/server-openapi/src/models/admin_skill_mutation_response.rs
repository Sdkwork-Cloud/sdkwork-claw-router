use serde::{Deserialize, Serialize};

use crate::models::{AdminSkillItem};

/// Admin skill mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillMutationResponse {
    /// Item field on admin skill mutation response.
    pub item: AdminSkillItem,
}
