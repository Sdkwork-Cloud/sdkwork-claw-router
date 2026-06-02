use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Ai generation asset record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiGenerationAssetRecord {
    /// Active index field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub active_index: Option<i64>,

    /// Asset field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset: Option<MediaResource>,

    /// Asset type field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_type: Option<String>,

    /// Created at field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Download count field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub download_count: Option<String>,

    /// Duration seconds field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<String>,

    /// Expire at field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expire_at: Option<String>,

    /// Favorite field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub favorite: Option<bool>,

    /// File size field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_size: Option<String>,

    /// Height field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub height: Option<i64>,

    /// Id field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Job id field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub job_id: Option<String>,

    /// Last accessed at field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_accessed_at: Option<String>,

    /// Metadata field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Mime type field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,

    /// Model snapshot field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_snapshot: Option<String>,

    /// Object key field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub object_key: Option<String>,

    /// Organization id field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Parameter snapshot field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parameter_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Prompt snapshot field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub prompt_snapshot: Option<String>,

    /// Share token hash field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub share_token_hash: Option<String>,

    /// Shared field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub shared: Option<bool>,

    /// Status field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Storage provider field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub storage_provider: Option<String>,

    /// Tenant id field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Thumbnail field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<MediaResource>,

    /// Updated at field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Visibility field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,

    /// Width field on ai generation asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub width: Option<i64>,
}
