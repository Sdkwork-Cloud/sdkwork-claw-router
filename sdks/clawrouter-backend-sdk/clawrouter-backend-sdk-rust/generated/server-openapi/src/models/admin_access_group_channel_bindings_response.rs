use serde::{Deserialize, Serialize};

use crate::models::{AdminAccessGroupChannelBindingItem};

/// Admin access group channel bindings response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAccessGroupChannelBindingsResponse {
    /// Items field on admin access group channel bindings response.
    pub items: Vec<AdminAccessGroupChannelBindingItem>,
}
