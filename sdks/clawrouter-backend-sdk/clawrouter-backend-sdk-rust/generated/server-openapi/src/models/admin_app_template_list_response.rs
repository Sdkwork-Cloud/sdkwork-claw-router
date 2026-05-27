use serde::{Deserialize, Serialize};

use crate::models::{AdminAppTemplateItemResponse};

/// Admin app template list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppTemplateListResponse {
    /// Has next page field on admin app template list response.
    #[serde(rename = "hasNextPage")]
    pub has_next_page: bool,

    /// App template snapshots returned by the backend management API.
    pub items: Vec<AdminAppTemplateItemResponse>,

    /// Page field on admin app template list response.
    pub page: i64,

    /// Page size field on admin app template list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on admin app template list response.
    pub total: i64,
}
