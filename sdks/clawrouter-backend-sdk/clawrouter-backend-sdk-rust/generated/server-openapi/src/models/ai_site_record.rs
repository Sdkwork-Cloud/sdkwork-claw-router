use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Ai site record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiSiteRecord {
    /// Base url field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_url: Option<String>,

    /// Color token field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color_token: Option<String>,

    /// Consecutive error count field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<String>,

    /// Created at field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Description field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Display name field on ai site record.
    pub display_name: String,

    /// Docs url field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub docs_url: Option<String>,

    /// Environment field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Health status field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last checked at field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_checked_at: Option<String>,

    /// Last latency ms field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_latency_ms: Option<i64>,

    /// Last sync at field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_sync_at: Option<String>,

    /// Logo field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub logo: Option<MediaResource>,

    /// Metadata field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai site record.
    pub organization_id: String,

    /// Owner kind field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_kind: Option<String>,

    /// Region code field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Site code field on ai site record.
    pub site_code: String,

    /// Site name field on ai site record.
    pub site_name: String,

    /// Site type field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub site_type: Option<String>,

    /// Sort order field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on ai site record.
    pub status: String,

    /// Tenant id field on ai site record.
    pub tenant_id: String,

    /// Updated at field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai site record.
    pub uuid: String,

    /// Version field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Website url field on ai site record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub website_url: Option<String>,
}
