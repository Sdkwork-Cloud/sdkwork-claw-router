use serde::{Deserialize, Serialize};

/// Integration service provider member record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderMemberRecord {
    /// Created at field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Member user id field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub member_user_id: Option<String>,

    /// Metadata field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Permission policy id field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub permission_policy_id: Option<String>,

    /// Role code field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub role_code: Option<String>,

    /// Service provider id field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub service_provider_id: Option<String>,

    /// Status field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider member record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
