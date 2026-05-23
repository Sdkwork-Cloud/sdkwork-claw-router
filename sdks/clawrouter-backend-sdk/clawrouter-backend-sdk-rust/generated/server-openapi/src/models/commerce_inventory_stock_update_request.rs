use serde::{Deserialize, Serialize};

/// Commerce inventory stock update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryStockUpdateRequest {
    /// Available quantity field on commerce inventory stock update request.
    #[serde(rename = "availableQuantity")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub available_quantity: Option<i64>,

    /// Reason code field on commerce inventory stock update request.
    #[serde(rename = "reasonCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason_code: Option<String>,

    /// Reserved quantity field on commerce inventory stock update request.
    #[serde(rename = "reservedQuantity")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reserved_quantity: Option<i64>,

    /// Status field on commerce inventory stock update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Version field on commerce inventory stock update request.
    pub version: i64,
}
