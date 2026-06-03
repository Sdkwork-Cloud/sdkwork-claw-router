use serde::{Deserialize, Serialize};

use crate::models::{AdminSiteModelItem};

/// Admin site models response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSiteModelsResponse {
    /// Items field on admin site models response.
    pub items: Vec<AdminSiteModelItem>,
}
