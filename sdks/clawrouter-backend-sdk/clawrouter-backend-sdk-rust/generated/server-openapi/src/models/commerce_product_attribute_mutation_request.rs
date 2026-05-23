use serde::{Deserialize, Serialize};

/// Commerce product attribute mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductAttributeMutationRequest {
    /// Attribute no field on commerce product attribute mutation request.
    #[serde(rename = "attributeNo")]
    pub attribute_no: String,

    /// Filterable field on commerce product attribute mutation request.
    pub filterable: bool,

    /// Name field on commerce product attribute mutation request.
    pub name: String,

    /// Required field on commerce product attribute mutation request.
    pub required: bool,

    /// Scope field on commerce product attribute mutation request.
    pub scope: String,

    /// Searchable field on commerce product attribute mutation request.
    pub searchable: bool,

    /// Status field on commerce product attribute mutation request.
    pub status: String,

    /// Value type field on commerce product attribute mutation request.
    #[serde(rename = "valueType")]
    pub value_type: String,
}
