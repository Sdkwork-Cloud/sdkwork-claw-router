use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseItem};

/// Admin course collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseCollectionResponse {
    /// Items field on admin course collection response.
    pub items: Vec<AdminCourseItem>,
}
