use serde::{Deserialize, Serialize};

use crate::models::{AdminUserItem};

/// Admin users response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminUsersResponse {
    /// Items field on admin users response.
    pub items: Vec<AdminUserItem>,
}
