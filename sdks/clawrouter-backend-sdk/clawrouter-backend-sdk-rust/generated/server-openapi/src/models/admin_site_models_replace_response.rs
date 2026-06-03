use serde::{Deserialize, Serialize};

use crate::models::{AdminSiteModelItem};

/// Admin site models replace response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSiteModelsReplaceResponse {
    /// Items field on admin site models replace response.
    pub items: Vec<AdminSiteModelItem>,
}
