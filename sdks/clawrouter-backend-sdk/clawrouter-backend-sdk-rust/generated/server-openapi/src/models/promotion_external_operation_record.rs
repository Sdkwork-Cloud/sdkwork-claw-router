use serde::{Deserialize, Serialize};

/// Promotion external operation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionExternalOperationRecord {
    /// Aggregate id field on promotion external operation record.
    pub aggregate_id: String,

    /// Aggregate type field on promotion external operation record.
    pub aggregate_type: String,

    /// Binding id field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub binding_id: Option<String>,

    /// Callback at field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub callback_at: Option<String>,

    /// Callback id field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub callback_id: Option<String>,

    /// Callback sig hash field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub callback_sig_hash: Option<String>,

    /// Cancel until field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cancel_until: Option<String>,

    /// Created at field on promotion external operation record.
    pub created_at: String,

    /// Error code field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_code: Option<String>,

    /// Error message field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message: Option<String>,

    /// External operation id field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_operation_id: Option<String>,

    /// External request no field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_request_no: Option<String>,

    /// External status field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_status: Option<String>,

    /// Idempotency key field on promotion external operation record.
    pub idempotency_key: String,

    /// Next retry at field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub next_retry_at: Option<String>,

    /// Occurred at field on promotion external operation record.
    pub occurred_at: String,

    /// Operation no field on promotion external operation record.
    pub operation_no: String,

    /// Operation type field on promotion external operation record.
    pub operation_type: String,

    /// Organization id field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Platform field on promotion external operation record.
    pub platform: String,

    /// Provider code field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider request id field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_request_id: Option<String>,

    /// Replay op id field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub replay_op_id: Option<String>,

    /// Request hash field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_hash: Option<String>,

    /// Response hash field on promotion external operation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_hash: Option<String>,

    /// Sanitized request json field on promotion external operation record.
    pub sanitized_request_json: std::collections::HashMap<String, String>,

    /// Sanitized response json field on promotion external operation record.
    pub sanitized_response_json: std::collections::HashMap<String, String>,

    /// Status field on promotion external operation record.
    pub status: String,

    /// Tenant id field on promotion external operation record.
    pub tenant_id: String,
}
