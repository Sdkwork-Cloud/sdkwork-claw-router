use serde::{Deserialize, Serialize};

/// Commerce product spu mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSpuMutationRequest {
    /// Brand field on commerce product spu mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,

    /// Category ids field on commerce product spu mutation request.
    #[serde(rename = "categoryIds")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_ids: Option<Vec<String>>,

    /// Description field on commerce product spu mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Product type field on commerce product spu mutation request.
    #[serde(rename = "productType")]
    pub product_type: String,

    /// Spu no field on commerce product spu mutation request.
    #[serde(rename = "spuNo")]
    pub spu_no: String,

    /// Status field on commerce product spu mutation request.
    pub status: String,

    /// Subtitle field on commerce product spu mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subtitle: Option<String>,

    /// Title field on commerce product spu mutation request.
    pub title: String,
}
