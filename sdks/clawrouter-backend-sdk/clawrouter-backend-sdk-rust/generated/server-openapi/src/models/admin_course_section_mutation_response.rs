use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseSectionItem};

/// Admin course section mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseSectionMutationResponse {
    /// Item field on admin course section mutation response.
    pub item: AdminCourseSectionItem,
}
