use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseLessonItem};

/// Admin course lesson mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseLessonMutationResponse {
    /// Item field on admin course lesson mutation response.
    pub item: AdminCourseLessonItem,
}
