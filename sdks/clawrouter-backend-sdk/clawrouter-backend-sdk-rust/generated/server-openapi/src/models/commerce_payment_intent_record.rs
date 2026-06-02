use serde::{Deserialize, Serialize};

/// Commerce payment intent record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentIntentRecord {
    /// Amount field on commerce payment intent record.
    pub amount: String,

    /// Captured amount field on commerce payment intent record.
    pub captured_amount: String,

    /// Created at field on commerce payment intent record.
    pub created_at: String,

    /// Currency code field on commerce payment intent record.
    pub currency_code: String,

    /// Id field on commerce payment intent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce payment intent record.
    pub idempotency_key: String,

    /// Merchant order no field on commerce payment intent record.
    pub merchant_order_no: String,

    /// Metadata json field on commerce payment intent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_json: Option<String>,

    /// Next action json field on commerce payment intent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub next_action_json: Option<String>,

    /// Order id field on commerce payment intent record.
    pub order_id: String,

    /// Organization id field on commerce payment intent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce payment intent record.
    pub owner_user_id: String,

    /// Payment method field on commerce payment intent record.
    pub payment_method: String,

    /// Provider field on commerce payment intent record.
    pub provider: String,

    /// Provider code field on commerce payment intent record.
    pub provider_code: String,

    /// Provider native json field on commerce payment intent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_native_json: Option<String>,

    /// Refunded amount field on commerce payment intent record.
    pub refunded_amount: String,

    /// Request no field on commerce payment intent record.
    pub request_no: String,

    /// Scene code field on commerce payment intent record.
    pub scene_code: String,

    /// Status field on commerce payment intent record.
    pub status: String,

    /// Subject field on commerce payment intent record.
    pub subject: String,

    /// Tenant id field on commerce payment intent record.
    pub tenant_id: String,

    /// Updated at field on commerce payment intent record.
    pub updated_at: String,
}
