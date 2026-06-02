use serde::{Deserialize, Serialize};

/// Ai route idempotency record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRouteIdempotencyRecord {
    /// Api key id field on ai route idempotency record.
    pub api_key_id: String,

    /// Channel group id field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_group_id: Option<String>,

    /// Channel id field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Created at field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Endpoint id field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint_id: Option<String>,

    /// Expires at field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Id field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on ai route idempotency record.
    pub idempotency_key: String,

    /// Metadata field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Object id field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_id: Option<String>,

    /// Object type field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_type: Option<String>,

    /// Organization id field on ai route idempotency record.
    pub organization_id: String,

    /// Request hash field on ai route idempotency record.
    pub request_hash: String,

    /// Response status field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_status: Option<i64>,

    /// Route strategy field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub route_strategy: Option<String>,

    /// Status field on ai route idempotency record.
    pub status: String,

    /// Tenant id field on ai route idempotency record.
    pub tenant_id: String,

    /// Updated at field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai route idempotency record.
    pub uuid: String,

    /// Version field on ai route idempotency record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
