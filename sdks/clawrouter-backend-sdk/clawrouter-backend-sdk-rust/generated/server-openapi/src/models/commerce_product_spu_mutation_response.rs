use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSpuItem};

/// Commerce product spu mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSpuMutationResponse {
    /// Item field on commerce product spu mutation response.
    pub item: CommerceProductSpuItem,
}
