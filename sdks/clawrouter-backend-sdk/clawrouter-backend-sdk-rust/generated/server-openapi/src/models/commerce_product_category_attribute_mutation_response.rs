use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductCategoryAttributeItem};

/// Commerce product category attribute mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryAttributeMutationResponse {
    /// Item field on commerce product category attribute mutation response.
    pub item: CommerceProductCategoryAttributeItem,
}
