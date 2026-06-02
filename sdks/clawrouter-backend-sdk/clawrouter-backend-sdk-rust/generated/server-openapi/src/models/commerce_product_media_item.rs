use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Commerce product media item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductMediaItem {
    /// Alt text field on commerce product media item.
    #[serde(rename = "altText")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alt_text: Option<String>,

    /// Id field on commerce product media item.
    pub id: String,

    /// Media role field on commerce product media item.
    #[serde(rename = "mediaRole")]
    pub media_role: String,

    /// Owner id field on commerce product media item.
    #[serde(rename = "ownerId")]
    pub owner_id: String,

    /// Owner type field on commerce product media item.
    #[serde(rename = "ownerType")]
    pub owner_type: String,

    /// Resource field on commerce product media item.
    pub resource: MediaResource,

    /// Sort order field on commerce product media item.
    #[serde(rename = "sortOrder")]
    pub sort_order: i64,

    /// Status field on commerce product media item.
    pub status: String,
}
