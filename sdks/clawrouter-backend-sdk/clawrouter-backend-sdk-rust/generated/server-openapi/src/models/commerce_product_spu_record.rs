use serde::{Deserialize, Serialize};

/// Commerce product spu record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSpuRecord {
    /// Brand field on commerce product spu record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub brand: Option<String>,

    /// Created at field on commerce product spu record.
    pub created_at: String,

    /// Description field on commerce product spu record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Id field on commerce product spu record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce product spu record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Product type field on commerce product spu record.
    pub product_type: String,

    /// Published at field on commerce product spu record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Spu no field on commerce product spu record.
    pub spu_no: String,

    /// Status field on commerce product spu record.
    pub status: String,

    /// Subtitle field on commerce product spu record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subtitle: Option<String>,

    /// Tenant id field on commerce product spu record.
    pub tenant_id: String,

    /// Title field on commerce product spu record.
    pub title: String,

    /// Updated at field on commerce product spu record.
    pub updated_at: String,
}
