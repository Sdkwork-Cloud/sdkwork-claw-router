use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseItem};

/// Admin course mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseMutationResponse {
    /// Item field on admin course mutation response.
    pub item: AdminCourseItem,
}
