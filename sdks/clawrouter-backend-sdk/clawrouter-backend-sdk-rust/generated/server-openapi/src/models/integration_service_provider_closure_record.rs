use serde::{Deserialize, Serialize};

/// Integration service provider closure record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderClosureRecord {
    /// Ancestor provider id field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ancestor_provider_id: Option<String>,

    /// Created at field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Depth field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub depth: Option<i64>,

    /// Descendant provider id field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub descendant_provider_id: Option<String>,

    /// Direct edge id field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub direct_edge_id: Option<String>,

    /// Effective from field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Path field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Status field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider closure record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
