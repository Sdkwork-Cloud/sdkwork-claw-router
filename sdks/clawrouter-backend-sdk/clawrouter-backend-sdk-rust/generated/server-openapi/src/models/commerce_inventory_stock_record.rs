use serde::{Deserialize, Serialize};

/// Commerce inventory stock record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryStockRecord {
    /// Available quantity field on commerce inventory stock record.
    pub available_quantity: String,

    /// Created at field on commerce inventory stock record.
    pub created_at: String,

    /// Id field on commerce inventory stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce inventory stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Reserved quantity field on commerce inventory stock record.
    pub reserved_quantity: String,

    /// Sku id field on commerce inventory stock record.
    pub sku_id: String,

    /// Sold quantity field on commerce inventory stock record.
    pub sold_quantity: String,

    /// Status field on commerce inventory stock record.
    pub status: String,

    /// Tenant id field on commerce inventory stock record.
    pub tenant_id: String,

    /// Updated at field on commerce inventory stock record.
    pub updated_at: String,

    /// Version field on commerce inventory stock record.
    pub version: String,

    /// Warehouse id field on commerce inventory stock record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub warehouse_id: Option<String>,
}
