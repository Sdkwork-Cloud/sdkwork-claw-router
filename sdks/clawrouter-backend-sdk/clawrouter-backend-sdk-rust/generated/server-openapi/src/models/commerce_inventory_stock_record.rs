use serde::{Deserialize, Serialize};

/// Commerce inventory stock record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryStockRecord {
    /// Created at field on commerce inventory stock record.
    pub created_at: String,

    /// Organization id field on commerce inventory stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Sku id field on commerce inventory stock record.
    pub sku_id: String,

    /// Status field on commerce inventory stock record.
    pub status: String,

    /// Tenant id field on commerce inventory stock record.
    pub tenant_id: String,

    /// Updated at field on commerce inventory stock record.
    pub updated_at: String,

    /// Warehouse id field on commerce inventory stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub warehouse_id: Option<String>,
}
