use serde::{Deserialize, Serialize};

use crate::models::{AdminAppItemResponse};

/// Admin app list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppListResponse {
    /// PlusApp snapshots returned by the backend management API.
    pub items: Vec<AdminAppItemResponse>,
}
