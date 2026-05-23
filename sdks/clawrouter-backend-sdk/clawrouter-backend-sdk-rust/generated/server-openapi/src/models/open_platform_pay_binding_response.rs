use serde::{Deserialize, Serialize};

use crate::models::{OpenPlatformPayBindingItem};

/// Open platform pay binding response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformPayBindingResponse {
    /// Item field on open platform pay binding response.
    pub item: OpenPlatformPayBindingItem,
}
