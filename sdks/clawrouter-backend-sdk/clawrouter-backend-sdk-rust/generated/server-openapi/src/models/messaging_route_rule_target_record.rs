use serde::{Deserialize, Serialize};

/// Messaging route rule target record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingRouteRuleTargetRecord {
    /// Circuit breaker policy field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub circuit_breaker_policy: Option<std::collections::HashMap<String, String>>,

    /// Created at field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider account id field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Route rule id field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub route_rule_id: Option<String>,

    /// Sender identity id field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sender_identity_id: Option<String>,

    /// Status field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target order field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_order: Option<i64>,

    /// Template binding id field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_binding_id: Option<String>,

    /// Tenant id field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Weight field on messaging route rule target record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
