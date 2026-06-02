use serde::{Deserialize, Serialize};

/// Ai resource route profile record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiResourceRouteProfileRecord {
    /// Billing meter code field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_code: Option<String>,

    /// Cache ttl seconds field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cache_ttl_seconds: Option<String>,

    /// Capability field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,

    /// Created at field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Endpoint failover scope field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint_failover_scope: Option<String>,

    /// Failure strategy field on ai resource route profile record.
    pub failure_strategy: String,

    /// Http method field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub http_method: Option<String>,

    /// Id field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency mode field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_mode: Option<String>,

    /// Metadata field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model requirement field on ai resource route profile record.
    pub model_requirement: String,

    /// Organization id field on ai resource route profile record.
    pub organization_id: String,

    /// Parent object types field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_object_types: Option<std::collections::HashMap<String, String>>,

    /// Path pattern field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path_pattern: Option<String>,

    /// Request extractors field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_extractors: Option<std::collections::HashMap<String, String>>,

    /// Resource code field on ai resource route profile record.
    pub resource_code: String,

    /// Resource id field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_id: Option<String>,

    /// Response bindings field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_bindings: Option<std::collections::HashMap<String, String>>,

    /// Route key field on ai resource route profile record.
    pub route_key: String,

    /// Route strategy field on ai resource route profile record.
    pub route_strategy: String,

    /// Selection strategy field on ai resource route profile record.
    pub selection_strategy: String,

    /// Sort order field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai resource route profile record.
    pub status: String,

    /// Sticky object type field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sticky_object_type: Option<String>,

    /// Sticky scope field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sticky_scope: Option<String>,

    /// Tenant id field on ai resource route profile record.
    pub tenant_id: String,

    /// Updated at field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai resource route profile record.
    pub uuid: String,

    /// Version field on ai resource route profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
