use serde::{Deserialize, Serialize};

/// Commerce inventory reservation item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryReservationItem {
    /// Checkout session id field on commerce inventory reservation item.
    #[serde(rename = "checkoutSessionId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checkout_session_id: Option<String>,

    /// Created at field on commerce inventory reservation item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Expires at field on commerce inventory reservation item.
    #[serde(rename = "expiresAt")]
    pub expires_at: String,

    /// Id field on commerce inventory reservation item.
    pub id: String,

    /// Order id field on commerce inventory reservation item.
    #[serde(rename = "orderId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub order_id: Option<String>,

    /// Quantity field on commerce inventory reservation item.
    pub quantity: i64,

    /// Reservation no field on commerce inventory reservation item.
    #[serde(rename = "reservationNo")]
    pub reservation_no: String,

    /// Sku id field on commerce inventory reservation item.
    #[serde(rename = "skuId")]
    pub sku_id: String,

    /// Status field on commerce inventory reservation item.
    pub status: String,
}
