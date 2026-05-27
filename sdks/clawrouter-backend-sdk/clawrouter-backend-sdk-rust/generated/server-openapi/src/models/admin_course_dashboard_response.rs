use serde::{Deserialize, Serialize};

use crate::models::{AdminCourseDashboard};

/// Admin course dashboard response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseDashboardResponse {
    /// Item field on admin course dashboard response.
    pub item: AdminCourseDashboard,
}
