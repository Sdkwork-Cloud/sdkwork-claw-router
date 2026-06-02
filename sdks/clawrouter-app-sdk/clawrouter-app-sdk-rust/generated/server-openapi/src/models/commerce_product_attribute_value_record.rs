use serde::{Deserialize, Serialize};

/// Commerce product attribute value record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductAttributeValueRecord {
    /// Attribute id field on commerce product attribute value record.
    pub attribute_id: String,

    /// Created at field on commerce product attribute value record.
    pub created_at: String,

    /// Display value field on commerce product attribute value record.
    pub display_value: String,

    /// Id field on commerce product attribute value record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce product attribute value record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Sort order field on commerce product attribute value record.
    pub sort_order: String,

    /// Status field on commerce product attribute value record.
    pub status: String,

    /// Tenant id field on commerce product attribute value record.
    pub tenant_id: String,

    /// Updated at field on commerce product attribute value record.
    pub updated_at: String,

    /// Value code field on commerce product attribute value record.
    pub value_code: String,
}
