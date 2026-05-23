use serde::{Deserialize, Serialize};

/// Commerce payment intent record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentIntentRecord {
    /// Amount field on commerce payment intent record.
    pub amount: String,

    /// Created at field on commerce payment intent record.
    pub created_at: String,

    /// Currency code field on commerce payment intent record.
    pub currency_code: String,

    /// Idempotency key field on commerce payment intent record.
    pub idempotency_key: String,

    /// Order id field on commerce payment intent record.
    pub order_id: String,

    /// Organization id field on commerce payment intent record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce payment intent record.
    pub owner_user_id: String,

    /// Provider field on commerce payment intent record.
    pub provider: String,

    /// Request no field on commerce payment intent record.
    pub request_no: String,

    /// Status field on commerce payment intent record.
    pub status: String,

    /// Tenant id field on commerce payment intent record.
    pub tenant_id: String,

    /// Updated at field on commerce payment intent record.
    pub updated_at: String,
}
