use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuItem};

/// Commerce product sku response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSkuResponse {
    /// Item field on commerce product sku response.
    pub item: CommerceProductSkuItem,
}
