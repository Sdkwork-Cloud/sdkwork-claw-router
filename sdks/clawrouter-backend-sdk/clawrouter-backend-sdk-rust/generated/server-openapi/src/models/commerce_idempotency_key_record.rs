use serde::{Deserialize, Serialize};

/// Commerce idempotency key record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceIdempotencyKeyRecord {
    /// Created at field on commerce idempotency key record.
    pub created_at: String,

    /// Expires at field on commerce idempotency key record.
    pub expires_at: String,

    /// Idempotency key field on commerce idempotency key record.
    pub idempotency_key: String,

    /// Locked until field on commerce idempotency key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub locked_until: Option<String>,

    /// Organization id field on commerce idempotency key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Request hash field on commerce idempotency key record.
    pub request_hash: String,

    /// Response json field on commerce idempotency key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_json: Option<String>,

    /// Scope field on commerce idempotency key record.
    pub scope: String,

    /// Status field on commerce idempotency key record.
    pub status: String,

    /// Tenant id field on commerce idempotency key record.
    pub tenant_id: String,

    /// Updated at field on commerce idempotency key record.
    pub updated_at: String,
}
