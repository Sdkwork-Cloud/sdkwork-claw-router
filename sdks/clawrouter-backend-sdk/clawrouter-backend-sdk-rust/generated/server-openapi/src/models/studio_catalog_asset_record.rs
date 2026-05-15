use serde::{Deserialize, Serialize};

/// Studio catalog asset record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StudioCatalogAssetRecord {
    /// Alt text field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alt_text: Option<String>,

    /// Artifact id field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub artifact_id: Option<String>,

    /// Asset type field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_type: Option<String>,

    /// Asset url field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_url: Option<String>,

    /// Created at field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Duration seconds field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub duration_seconds: Option<String>,

    /// File size field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_size: Option<String>,

    /// Height field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub height: Option<i64>,

    /// Id field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Mime type field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,

    /// Organization id field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Published at field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub published_at: Option<String>,

    /// Sort order field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target id field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_id: Option<String>,

    /// Target type field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Tenant id field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Thumbnail url field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub thumbnail_url: Option<String>,

    /// Title field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Width field on studio catalog asset record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub width: Option<i64>,
}
