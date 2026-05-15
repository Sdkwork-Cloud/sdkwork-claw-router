use serde::{Deserialize, Serialize};

/// Integration proxy record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationProxyRecord {
    /// Created at field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Endpoint field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub endpoint: Option<String>,

    /// Health status field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last checked at field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_checked_at: Option<String>,

    /// Metadata field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Proxy code field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub proxy_code: Option<String>,

    /// Proxy type field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub proxy_type: Option<String>,

    /// Region field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region: Option<String>,

    /// Secret hash field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_hash: Option<String>,

    /// Secret ref field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Status field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration proxy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
