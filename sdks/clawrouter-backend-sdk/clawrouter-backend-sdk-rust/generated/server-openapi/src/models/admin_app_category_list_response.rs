use serde::{Deserialize, Serialize};

use crate::models::{AdminAppCategoryItem};

/// Admin app category list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppCategoryListResponse {
    /// App store category snapshots returned by the backend.
    pub items: Vec<AdminAppCategoryItem>,
}
