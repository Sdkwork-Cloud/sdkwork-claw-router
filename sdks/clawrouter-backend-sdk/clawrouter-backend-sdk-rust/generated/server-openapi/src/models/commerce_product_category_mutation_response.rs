use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductCategoryItem};

/// Commerce product category mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryMutationResponse {
    /// Item field on commerce product category mutation response.
    pub item: CommerceProductCategoryItem,
}
