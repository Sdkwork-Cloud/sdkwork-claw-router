use serde::{Deserialize, Serialize};

use crate::models::{AdminAppItemResponse};

/// Admin app list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppListResponse {
    /// Has next page field on admin app list response.
    #[serde(rename = "hasNextPage")]
    pub has_next_page: bool,

    /// PlusApp snapshots returned by the backend management API.
    pub items: Vec<AdminAppItemResponse>,

    /// Page field on admin app list response.
    pub page: i64,

    /// Page size field on admin app list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on admin app list response.
    pub total: i64,
}
