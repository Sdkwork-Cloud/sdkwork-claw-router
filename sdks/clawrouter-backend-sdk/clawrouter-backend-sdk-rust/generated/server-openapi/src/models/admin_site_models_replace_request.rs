use serde::{Deserialize, Serialize};

use crate::models::{AdminSiteModelCreateRequest};

/// Admin site models replace request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSiteModelsReplaceRequest {
    /// Items field on admin site models replace request.
    pub items: Vec<AdminSiteModelCreateRequest>,
}
