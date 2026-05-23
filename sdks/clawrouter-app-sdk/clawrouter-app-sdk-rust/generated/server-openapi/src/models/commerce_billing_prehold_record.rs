use serde::{Deserialize, Serialize};

/// Commerce billing prehold record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceBillingPreholdRecord {
    /// Account id field on commerce billing prehold record.
    pub account_id: String,

    /// Amount field on commerce billing prehold record.
    pub amount: String,

    /// Asset type field on commerce billing prehold record.
    pub asset_type: String,

    /// Created at field on commerce billing prehold record.
    pub created_at: String,

    /// Expires at field on commerce billing prehold record.
    pub expires_at: String,

    /// Idempotency key field on commerce billing prehold record.
    pub idempotency_key: String,

    /// Organization id field on commerce billing prehold record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce billing prehold record.
    pub owner_user_id: String,

    /// Prehold no field on commerce billing prehold record.
    pub prehold_no: String,

    /// Released at field on commerce billing prehold record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub released_at: Option<String>,

    /// Request no field on commerce billing prehold record.
    pub request_no: String,

    /// Settled at field on commerce billing prehold record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settled_at: Option<String>,

    /// Status field on commerce billing prehold record.
    pub status: String,

    /// Tenant id field on commerce billing prehold record.
    pub tenant_id: String,

    /// Updated at field on commerce billing prehold record.
    pub updated_at: String,
}
