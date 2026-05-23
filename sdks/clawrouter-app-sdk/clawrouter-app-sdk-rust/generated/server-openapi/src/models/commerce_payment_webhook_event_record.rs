use serde::{Deserialize, Serialize};

/// Commerce payment webhook event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentWebhookEventRecord {
    /// Created at field on commerce payment webhook event record.
    pub created_at: String,

    /// Event id field on commerce payment webhook event record.
    pub event_id: String,

    /// Idempotency key field on commerce payment webhook event record.
    pub idempotency_key: String,

    /// Message field on commerce payment webhook event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Nonce field on commerce payment webhook event record.
    pub nonce: String,

    /// Organization id field on commerce payment webhook event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Out trade no field on commerce payment webhook event record.
    pub out_trade_no: String,

    /// Payload digest field on commerce payment webhook event record.
    pub payload_digest: String,

    /// Processed at field on commerce payment webhook event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub processed_at: Option<String>,

    /// Provider field on commerce payment webhook event record.
    pub provider: String,

    /// Request no field on commerce payment webhook event record.
    pub request_no: String,

    /// Request timestamp field on commerce payment webhook event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_timestamp: Option<String>,

    /// Signature field on commerce payment webhook event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub signature: Option<String>,

    /// Status field on commerce payment webhook event record.
    pub status: String,

    /// Tenant id field on commerce payment webhook event record.
    pub tenant_id: String,

    /// Transaction id field on commerce payment webhook event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub transaction_id: Option<String>,

    /// Updated at field on commerce payment webhook event record.
    pub updated_at: String,
}
