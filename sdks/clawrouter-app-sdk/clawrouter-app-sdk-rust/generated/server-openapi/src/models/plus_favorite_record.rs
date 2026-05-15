use serde::{Deserialize, Serialize};

/// Plus favorite record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusFavoriteRecord {
    /// Folder id field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub folder_id: Option<String>,

    /// Image field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub image: Option<std::collections::HashMap<String, String>>,

    /// Last viewed at field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_viewed_at: Option<String>,

    /// Remark field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remark: Option<String>,

    /// Tags field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<String>,

    /// Title field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// User id field on plus favorite record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
