use serde::{Deserialize, Serialize};

use crate::models::{AdminAccessGroupChannelBindingInput};

/// Admin access group channel bindings replace request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAccessGroupChannelBindingsReplaceRequest {
    /// Items field on admin access group channel bindings replace request.
    pub items: Vec<AdminAccessGroupChannelBindingInput>,
}
