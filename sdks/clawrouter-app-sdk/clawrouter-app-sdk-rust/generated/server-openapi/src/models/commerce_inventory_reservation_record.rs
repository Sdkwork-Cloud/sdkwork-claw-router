use serde::{Deserialize, Serialize};

/// Commerce inventory reservation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryReservationRecord {
    /// Checkout session id field on commerce inventory reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub checkout_session_id: Option<String>,

    /// Created at field on commerce inventory reservation record.
    pub created_at: String,

    /// Expires at field on commerce inventory reservation record.
    pub expires_at: String,

    /// Id field on commerce inventory reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce inventory reservation record.
    pub idempotency_key: String,

    /// Order id field on commerce inventory reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub order_id: Option<String>,

    /// Organization id field on commerce inventory reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Quantity field on commerce inventory reservation record.
    pub quantity: String,

    /// Reservation no field on commerce inventory reservation record.
    pub reservation_no: String,

    /// Sku id field on commerce inventory reservation record.
    pub sku_id: String,

    /// Status field on commerce inventory reservation record.
    pub status: String,

    /// Tenant id field on commerce inventory reservation record.
    pub tenant_id: String,

    /// Updated at field on commerce inventory reservation record.
    pub updated_at: String,

    /// Warehouse id field on commerce inventory reservation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub warehouse_id: Option<String>,
}
