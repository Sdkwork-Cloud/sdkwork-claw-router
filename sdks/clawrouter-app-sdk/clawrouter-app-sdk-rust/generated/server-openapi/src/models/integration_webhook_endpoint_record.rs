use serde::{Deserialize, Serialize};

/// Integration webhook endpoint record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationWebhookEndpointRecord {
    /// Created at field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Endpoint code field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint_code: Option<String>,

    /// Event types field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub event_types: Option<std::collections::HashMap<String, String>>,

    /// Failure count field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_count: Option<String>,

    /// Id field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last failure at field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_failure_at: Option<String>,

    /// Last success at field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_success_at: Option<String>,

    /// Metadata field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Retry policy field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_policy: Option<std::collections::HashMap<String, String>>,

    /// Secret hash field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_hash: Option<String>,

    /// Secret ref field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Signing alg field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub signing_alg: Option<String>,

    /// Status field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target url field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_url: Option<String>,

    /// Tenant id field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration webhook endpoint record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
