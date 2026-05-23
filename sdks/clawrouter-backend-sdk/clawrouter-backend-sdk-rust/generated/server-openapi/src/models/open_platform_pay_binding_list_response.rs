use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformPayBindingItem};

/// Open platform pay binding list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformPayBindingListResponse {
    /// Items field on open platform pay binding list response.
    pub items: Vec<OpenPlatformPayBindingItem>,
}
