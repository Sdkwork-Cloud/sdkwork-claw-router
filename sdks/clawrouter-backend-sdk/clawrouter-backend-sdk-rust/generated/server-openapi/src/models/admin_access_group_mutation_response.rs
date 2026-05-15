use serde::{Deserialize, Serialize};

use crate::models::{AdminAccessGroupItem};

/// Admin access group mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAccessGroupMutationResponse {
    /// Item field on admin access group mutation response.
    pub item: AdminAccessGroupItem,
}
