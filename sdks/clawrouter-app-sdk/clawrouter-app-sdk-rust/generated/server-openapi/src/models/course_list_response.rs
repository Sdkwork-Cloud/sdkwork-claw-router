use serde::{Deserialize, Serialize};

use crate::models::{CourseItem};

/// Course list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseListResponse {
    /// Content field on course list response.
    pub content: Vec<CourseItem>,

    /// Items field on course list response.
    pub items: Vec<CourseItem>,

    /// Page field on course list response.
    pub page: String,

    /// Size field on course list response.
    pub size: String,

    /// Total elements field on course list response.
    #[serde(rename = "totalElements")]
    pub total_elements: String,
}
