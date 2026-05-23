use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuItem};

/// Commerce product sku mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSkuMutationResponse {
    /// Item field on commerce product sku mutation response.
    pub item: CommerceProductSkuItem,
}
