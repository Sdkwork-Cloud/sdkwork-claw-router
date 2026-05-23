use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductAttributeItem};

/// Commerce product attribute mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductAttributeMutationResponse {
    /// Item field on commerce product attribute mutation response.
    pub item: CommerceProductAttributeItem,
}
