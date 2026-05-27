use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSkuItem, CommerceProductSpuItem};

/// Commerce product spu detail response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSpuDetailResponse {
    /// Item field on commerce product spu detail response.
    pub item: CommerceProductSpuItem,

    /// Skus field on commerce product spu detail response.
    pub skus: Vec<CommerceProductSkuItem>,
}
