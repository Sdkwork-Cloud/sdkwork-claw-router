use serde::{Deserialize, Serialize};

/// Commerce cart item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCartItemRecord {
    /// Cart id field on commerce cart item record.
    pub cart_id: String,

    /// Created at field on commerce cart item record.
    pub created_at: String,

    /// Metadata json field on commerce cart item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_json: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce cart item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Price snapshot json field on commerce cart item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_snapshot_json: Option<std::collections::HashMap<String, String>>,

    /// Sku id field on commerce cart item record.
    pub sku_id: String,

    /// Tenant id field on commerce cart item record.
    pub tenant_id: String,

    /// Updated at field on commerce cart item record.
    pub updated_at: String,
}
