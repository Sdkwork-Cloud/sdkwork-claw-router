use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseCommentItem};

/// Admin course comment collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseCommentCollectionResponse {
    /// Items field on admin course comment collection response.
    pub items: Vec<AdminCourseCommentItem>,
}
