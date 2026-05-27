use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseApplicationItem};

/// Admin course application collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseApplicationCollectionResponse {
    /// Items field on admin course application collection response.
    pub items: Vec<AdminCourseApplicationItem>,
}
