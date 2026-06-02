use serde::{Deserialize, Serialize};

/// Commerce payment operation attempt record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentOperationAttemptRecord {
    /// Channel id field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Completed at field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<String>,

    /// Created at field on commerce payment operation attempt record.
    pub created_at: String,

    /// Http status field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub http_status: Option<String>,

    /// Id field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce payment operation attempt record.
    pub idempotency_key: String,

    /// Native refund id field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub native_refund_id: Option<String>,

    /// Native request id field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub native_request_id: Option<String>,

    /// Native trade id field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub native_trade_id: Option<String>,

    /// Operation code field on commerce payment operation attempt record.
    pub operation_code: String,

    /// Operation no field on commerce payment operation attempt record.
    pub operation_no: String,

    /// Organization id field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider account id field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment operation attempt record.
    pub provider_code: String,

    /// Provider error code field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_error_code: Option<String>,

    /// Provider error message field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_error_message: Option<String>,

    /// Request digest field on commerce payment operation attempt record.
    pub request_digest: String,

    /// Response digest field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_digest: Option<String>,

    /// Retryable field on commerce payment operation attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retryable: Option<String>,

    /// Sdkwork resource id field on commerce payment operation attempt record.
    pub sdkwork_resource_id: String,

    /// Sdkwork resource type field on commerce payment operation attempt record.
    pub sdkwork_resource_type: String,

    /// Started at field on commerce payment operation attempt record.
    pub started_at: String,

    /// Status field on commerce payment operation attempt record.
    pub status: String,

    /// Tenant id field on commerce payment operation attempt record.
    pub tenant_id: String,
}
