use serde::{Deserialize, Serialize};

/// Commerce inventory ledger item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryLedgerItem {
    /// Balance after field on commerce inventory ledger item.
    #[serde(rename = "balanceAfter")]
    pub balance_after: String,

    /// Business type field on commerce inventory ledger item.
    #[serde(rename = "businessType")]
    pub business_type: String,

    /// Created at field on commerce inventory ledger item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Direction field on commerce inventory ledger item.
    pub direction: String,

    /// Id field on commerce inventory ledger item.
    pub id: String,

    /// Movement no field on commerce inventory ledger item.
    #[serde(rename = "movementNo")]
    pub movement_no: String,

    /// Quantity field on commerce inventory ledger item.
    pub quantity: String,

    /// Sku id field on commerce inventory ledger item.
    #[serde(rename = "skuId")]
    pub sku_id: String,

    /// Source id field on commerce inventory ledger item.
    #[serde(rename = "sourceId")]
    pub source_id: String,

    /// Source type field on commerce inventory ledger item.
    #[serde(rename = "sourceType")]
    pub source_type: String,

    /// Warehouse id field on commerce inventory ledger item.
    #[serde(rename = "warehouseId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub warehouse_id: Option<String>,
}
