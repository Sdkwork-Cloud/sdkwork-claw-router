use serde::{Deserialize, Serialize};

/// Ai config version record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiConfigVersionRecord {
    /// Changed object id field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub changed_object_id: Option<String>,

    /// Changed object type field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub changed_object_type: Option<String>,

    /// Config scope field on ai config version record.
    pub config_scope: String,

    /// Config version field on ai config version record.
    pub config_version: String,

    /// Created at field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai config version record.
    pub organization_id: String,

    /// Published at field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Status field on ai config version record.
    pub status: String,

    /// Tenant id field on ai config version record.
    pub tenant_id: String,

    /// Updated at field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai config version record.
    pub uuid: String,

    /// Version field on ai config version record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
