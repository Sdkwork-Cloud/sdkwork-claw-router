use serde::{Deserialize, Serialize};

/// Commerce order record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceOrderRecord {
    /// Cancelled at field on commerce order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cancelled_at: Option<String>,

    /// Created at field on commerce order record.
    pub created_at: String,

    /// Currency code field on commerce order record.
    pub currency_code: String,

    /// Expired at field on commerce order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expired_at: Option<String>,

    /// Id field on commerce order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce order record.
    pub idempotency_key: String,

    /// Order no field on commerce order record.
    pub order_no: String,

    /// Organization id field on commerce order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce order record.
    pub owner_user_id: String,

    /// Paid at field on commerce order record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub paid_at: Option<String>,

    /// Request no field on commerce order record.
    pub request_no: String,

    /// Status field on commerce order record.
    pub status: String,

    /// Subject field on commerce order record.
    pub subject: String,

    /// Tenant id field on commerce order record.
    pub tenant_id: String,

    /// Updated at field on commerce order record.
    pub updated_at: String,
}
