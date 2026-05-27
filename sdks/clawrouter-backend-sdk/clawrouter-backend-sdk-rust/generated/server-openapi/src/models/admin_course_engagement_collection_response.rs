use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseEngagementItem};

/// Admin course engagement collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseEngagementCollectionResponse {
    /// Items field on admin course engagement collection response.
    pub items: Vec<AdminCourseEngagementItem>,
}
