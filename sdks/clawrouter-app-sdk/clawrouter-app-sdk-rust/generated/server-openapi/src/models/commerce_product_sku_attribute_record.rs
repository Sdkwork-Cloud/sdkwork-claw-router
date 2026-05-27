use serde::{Deserialize, Serialize};

/// Commerce product sku attribute record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSkuAttributeRecord {
    /// Attribute id field on commerce product sku attribute record.
    pub attribute_id: String,

    /// Attribute value id field on commerce product sku attribute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attribute_value_id: Option<String>,

    /// Created at field on commerce product sku attribute record.
    pub created_at: String,

    /// Custom value field on commerce product sku attribute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub custom_value: Option<String>,

    /// Organization id field on commerce product sku attribute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Sku id field on commerce product sku attribute record.
    pub sku_id: String,

    /// Tenant id field on commerce product sku attribute record.
    pub tenant_id: String,

    /// Updated at field on commerce product sku attribute record.
    pub updated_at: String,
}
