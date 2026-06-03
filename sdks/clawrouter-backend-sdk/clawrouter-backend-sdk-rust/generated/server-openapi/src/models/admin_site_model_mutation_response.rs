use serde::{Deserialize, Serialize};

use crate::models::{AdminSiteModelItem};

/// Admin site model mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSiteModelMutationResponse {
    /// Item field on admin site model mutation response.
    pub item: AdminSiteModelItem,
}
