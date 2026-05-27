use serde::{Deserialize, Serialize};

/// Admin course delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseDeleteResponse {
    /// Deleted field on admin course delete response.
    pub deleted: bool,
}
