use serde::{Deserialize, Serialize};

/// Ai routing profile record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRoutingProfileRecord {
    /// Config hash field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config_hash: Option<String>,

    /// Created at field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Policy id field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_id: Option<String>,

    /// Profile name field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub profile_name: Option<String>,

    /// Profile version field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub profile_version: Option<String>,

    /// Published at field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Published by field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_by: Option<String>,

    /// Release status field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub release_status: Option<String>,

    /// Rollback from profile id field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rollback_from_profile_id: Option<String>,

    /// Status field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Traffic percent field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub traffic_percent: Option<String>,

    /// Updated at field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai routing profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
