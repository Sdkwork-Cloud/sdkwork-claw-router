use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseApplicationItem};

/// Admin course application review response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseApplicationReviewResponse {
    /// Item field on admin course application review response.
    pub item: AdminCourseApplicationItem,
}
