use serde::{Deserialize, Serialize};

use crate::models::{AdminAccessGroupItem};

/// Admin access groups response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAccessGroupsResponse {
    /// Items field on admin access groups response.
    pub items: Vec<AdminAccessGroupItem>,
}
