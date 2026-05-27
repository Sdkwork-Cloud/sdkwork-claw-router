use serde::{Deserialize, Serialize};

/// Integration service provider record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderRecord {
    /// Activated at field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub activated_at: Option<String>,

    /// Created at field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default currency field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_currency: Option<String>,

    /// Default timezone field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_timezone: Option<String>,

    /// Deleted at field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Display name field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Id field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner organization id field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_organization_id: Option<String>,

    /// Owner tenant id field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_tenant_id: Option<String>,

    /// Owner user id field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_user_id: Option<String>,

    /// Provider no field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_no: Option<String>,

    /// Provider type field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_type: Option<String>,

    /// Risk level field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Status field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Suspended at field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub suspended_at: Option<String>,

    /// Suspended reason code field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub suspended_reason_code: Option<String>,

    /// Tenant id field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
