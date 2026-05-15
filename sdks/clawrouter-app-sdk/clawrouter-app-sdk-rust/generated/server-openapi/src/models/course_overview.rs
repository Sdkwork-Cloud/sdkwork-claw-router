use serde::{Deserialize, Serialize};

use crate::models::{CourseOverviewSource, CourseOverviewStats};

/// Course overview schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseOverview {
    /// Source field on course overview.
    pub source: CourseOverviewSource,

    /// Stats field on course overview.
    pub stats: CourseOverviewStats,
}
