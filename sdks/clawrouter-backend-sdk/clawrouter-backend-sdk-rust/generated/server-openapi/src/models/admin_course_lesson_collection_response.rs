use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseLessonItem};

/// Admin course lesson collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseLessonCollectionResponse {
    /// Items field on admin course lesson collection response.
    pub items: Vec<AdminCourseLessonItem>,
}
