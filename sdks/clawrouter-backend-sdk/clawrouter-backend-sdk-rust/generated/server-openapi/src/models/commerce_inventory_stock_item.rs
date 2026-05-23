use serde::{Deserialize, Serialize};

/// Commerce inventory stock item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryStockItem {
    /// Available quantity field on commerce inventory stock item.
    #[serde(rename = "availableQuantity")]
    pub available_quantity: i64,

    /// Created at field on commerce inventory stock item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on commerce inventory stock item.
    pub id: String,

    /// Reserved quantity field on commerce inventory stock item.
    #[serde(rename = "reservedQuantity")]
    pub reserved_quantity: i64,

    /// Sku id field on commerce inventory stock item.
    #[serde(rename = "skuId")]
    pub sku_id: String,

    /// Sold quantity field on commerce inventory stock item.
    #[serde(rename = "soldQuantity")]
    pub sold_quantity: i64,

    /// Status field on commerce inventory stock item.
    pub status: String,

    /// Updated at field on commerce inventory stock item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Version field on commerce inventory stock item.
    pub version: i64,

    /// Warehouse id field on commerce inventory stock item.
    #[serde(rename = "warehouseId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub warehouse_id: Option<String>,
}
