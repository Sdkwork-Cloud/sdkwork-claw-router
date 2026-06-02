use serde::{Deserialize, Serialize};

/// Commerce payment capture record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentCaptureRecord {
    /// Amount field on commerce payment capture record.
    pub amount: String,

    /// Capture no field on commerce payment capture record.
    pub capture_no: String,

    /// Created at field on commerce payment capture record.
    pub created_at: String,

    /// Currency code field on commerce payment capture record.
    pub currency_code: String,

    /// Failed at field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failed_at: Option<String>,

    /// Failure code field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message: Option<String>,

    /// Final capture field on commerce payment capture record.
    pub final_capture: String,

    /// Id field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce payment capture record.
    pub idempotency_key: String,

    /// Native capture id field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub native_capture_id: Option<String>,

    /// Organization id field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payment attempt id field on commerce payment capture record.
    pub payment_attempt_id: String,

    /// Provider account id field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment capture record.
    pub provider_code: String,

    /// Request no field on commerce payment capture record.
    pub request_no: String,

    /// Status field on commerce payment capture record.
    pub status: String,

    /// Submitted at field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub submitted_at: Option<String>,

    /// Succeeded at field on commerce payment capture record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub succeeded_at: Option<String>,

    /// Tenant id field on commerce payment capture record.
    pub tenant_id: String,

    /// Updated at field on commerce payment capture record.
    pub updated_at: String,
}
