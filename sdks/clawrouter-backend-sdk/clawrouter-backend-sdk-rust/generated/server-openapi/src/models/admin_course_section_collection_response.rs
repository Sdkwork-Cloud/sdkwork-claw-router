use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseSectionItem};

/// Admin course section collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseSectionCollectionResponse {
    /// Items field on admin course section collection response.
    pub items: Vec<AdminCourseSectionItem>,
}
