use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseRelationItem};

/// Admin course relation collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseRelationCollectionResponse {
    /// Items field on admin course relation collection response.
    pub items: Vec<AdminCourseRelationItem>,
}
