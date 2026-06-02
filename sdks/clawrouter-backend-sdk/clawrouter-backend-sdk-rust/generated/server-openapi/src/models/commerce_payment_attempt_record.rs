use serde::{Deserialize, Serialize};

/// Commerce payment attempt record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentAttemptRecord {
    /// Amount field on commerce payment attempt record.
    pub amount: String,

    /// Callback payload field on commerce payment attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub callback_payload: Option<String>,

    /// Created at field on commerce payment attempt record.
    pub created_at: String,

    /// Currency code field on commerce payment attempt record.
    pub currency_code: String,

    /// Id field on commerce payment attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Order id field on commerce payment attempt record.
    pub order_id: String,

    /// Organization id field on commerce payment attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Out trade no field on commerce payment attempt record.
    pub out_trade_no: String,

    /// Owner user id field on commerce payment attempt record.
    pub owner_user_id: String,

    /// Paid at field on commerce payment attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub paid_at: Option<String>,

    /// Payment intent id field on commerce payment attempt record.
    pub payment_intent_id: String,

    /// Provider field on commerce payment attempt record.
    pub provider: String,

    /// Status field on commerce payment attempt record.
    pub status: String,

    /// Tenant id field on commerce payment attempt record.
    pub tenant_id: String,

    /// Updated at field on commerce payment attempt record.
    pub updated_at: String,
}
