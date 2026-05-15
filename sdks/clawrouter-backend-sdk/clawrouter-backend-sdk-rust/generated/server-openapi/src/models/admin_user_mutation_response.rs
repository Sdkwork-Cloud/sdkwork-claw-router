use serde::{Deserialize, Serialize};

use crate::models::{AdminUserItem};

/// Admin user mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminUserMutationResponse {
    /// Item field on admin user mutation response.
    pub item: AdminUserItem,
}
