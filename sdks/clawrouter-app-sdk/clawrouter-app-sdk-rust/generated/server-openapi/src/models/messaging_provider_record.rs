use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Messaging provider record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingProviderRecord {
    /// Channel field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel: Option<String>,

    /// Created at field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Display name field on messaging provider record.
    pub display_name: String,

    /// Docs url field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Icon field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Id field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Metadata schema version field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_schema_version: Option<String>,

    /// Organization id field on messaging provider record.
    pub organization_id: String,

    /// Provider code field on messaging provider record.
    pub provider_code: String,

    /// Provider type field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_type: Option<String>,

    /// Sort order field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on messaging provider record.
    pub status: String,

    /// Tenant id field on messaging provider record.
    pub tenant_id: String,

    /// Updated at field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on messaging provider record.
    pub uuid: String,

    /// Version field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Website url field on messaging provider record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub website_url: Option<String>,
}
