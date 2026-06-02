use serde::{Deserialize, Serialize};

/// Commerce checkout session record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCheckoutSessionRecord {
    /// Checkout session no field on commerce checkout session record.
    pub checkout_session_no: String,

    /// Created at field on commerce checkout session record.
    pub created_at: String,

    /// Currency code field on commerce checkout session record.
    pub currency_code: String,

    /// Expires at field on commerce checkout session record.
    pub expires_at: String,

    /// Id field on commerce checkout session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce checkout session record.
    pub idempotency_key: String,

    /// Organization id field on commerce checkout session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce checkout session record.
    pub owner_user_id: String,

    /// Request hash field on commerce checkout session record.
    pub request_hash: String,

    /// Source id field on commerce checkout session record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on commerce checkout session record.
    pub source_type: String,

    /// Status field on commerce checkout session record.
    pub status: String,

    /// Tenant id field on commerce checkout session record.
    pub tenant_id: String,

    /// Updated at field on commerce checkout session record.
    pub updated_at: String,
}
