use serde::{Deserialize, Serialize};

/// Commerce product attribute record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductAttributeRecord {
    /// Attribute no field on commerce product attribute record.
    pub attribute_no: String,

    /// Created at field on commerce product attribute record.
    pub created_at: String,

    /// Filterable field on commerce product attribute record.
    pub filterable: bool,

    /// Name field on commerce product attribute record.
    pub name: String,

    /// Organization id field on commerce product attribute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Required field on commerce product attribute record.
    pub required: bool,

    /// Scope field on commerce product attribute record.
    pub scope: String,

    /// Searchable field on commerce product attribute record.
    pub searchable: bool,

    /// Status field on commerce product attribute record.
    pub status: String,

    /// Tenant id field on commerce product attribute record.
    pub tenant_id: String,

    /// Updated at field on commerce product attribute record.
    pub updated_at: String,

    /// Value type field on commerce product attribute record.
    pub value_type: String,
}
