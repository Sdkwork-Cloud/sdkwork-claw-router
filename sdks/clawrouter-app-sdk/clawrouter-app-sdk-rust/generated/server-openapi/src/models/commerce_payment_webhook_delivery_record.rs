use serde::{Deserialize, Serialize};

/// Commerce payment webhook delivery record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentWebhookDeliveryRecord {
    /// Created at field on commerce payment webhook delivery record.
    pub created_at: String,

    /// Delivery no field on commerce payment webhook delivery record.
    pub delivery_no: String,

    /// Delivery status field on commerce payment webhook delivery record.
    pub delivery_status: String,

    /// Event id field on commerce payment webhook delivery record.
    pub event_id: String,

    /// Failure code field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Failure message field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_message: Option<String>,

    /// Headers json field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub headers_json: Option<std::collections::HashMap<String, String>>,

    /// Id field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Nonce field on commerce payment webhook delivery record.
    pub nonce: String,

    /// Normalized event id field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub normalized_event_id: Option<String>,

    /// Organization id field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload digest field on commerce payment webhook delivery record.
    pub payload_digest: String,

    /// Payload ref field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_ref: Option<String>,

    /// Processed at field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub processed_at: Option<String>,

    /// Provider account id field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment webhook delivery record.
    pub provider_code: String,

    /// Received at field on commerce payment webhook delivery record.
    pub received_at: String,

    /// Request timestamp field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_timestamp: Option<String>,

    /// Signature field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub signature: Option<String>,

    /// Signature algorithm field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub signature_algorithm: Option<String>,

    /// Source ip field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_ip: Option<String>,

    /// Tenant id field on commerce payment webhook delivery record.
    pub tenant_id: String,

    /// Updated at field on commerce payment webhook delivery record.
    pub updated_at: String,

    /// User agent field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent: Option<String>,

    /// Verification status field on commerce payment webhook delivery record.
    pub verification_status: String,

    /// Verified at field on commerce payment webhook delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub verified_at: Option<String>,
}
