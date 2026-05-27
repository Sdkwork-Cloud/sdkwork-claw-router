use serde::{Deserialize, Serialize};

/// Commerce product media item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductMediaItem {
    /// Alt text field on commerce product media item.
    #[serde(rename = "altText")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub alt_text: Option<String>,

    /// Id field on commerce product media item.
    pub id: String,

    /// Media type field on commerce product media item.
    #[serde(rename = "mediaType")]
    pub media_type: String,

    /// Owner id field on commerce product media item.
    #[serde(rename = "ownerId")]
    pub owner_id: String,

    /// Owner type field on commerce product media item.
    #[serde(rename = "ownerType")]
    pub owner_type: String,

    /// Sort order field on commerce product media item.
    #[serde(rename = "sortOrder")]
    pub sort_order: i64,

    /// Status field on commerce product media item.
    pub status: String,

    /// Url field on commerce product media item.
    pub url: String,
}
