use serde::{Deserialize, Serialize};

/// Plus feeds record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusFeedsRecord {
    /// Author field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author: Option<std::collections::HashMap<String, String>>,

    /// Category id field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Comment count field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub comment_count: Option<String>,

    /// Content id field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_id: Option<String>,

    /// Content type field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub content_type: Option<i64>,

    /// Cover resources field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_resources: Option<std::collections::HashMap<String, String>>,

    /// Created at field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Favorite count field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub favorite_count: Option<String>,

    /// Id field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Is hot field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_hot: Option<bool>,

    /// Is recommended field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_recommended: Option<bool>,

    /// Is top field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub is_top: Option<bool>,

    /// Like count field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub like_count: Option<String>,

    /// Organization id field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Publish time field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub publish_time: Option<String>,

    /// Resource list field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_list: Option<std::collections::HashMap<String, String>>,

    /// Share count field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub share_count: Option<String>,

    /// Sort order field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Source field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,

    /// Source url field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_url: Option<String>,

    /// Status field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Summary field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Title field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    /// Updated at field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,

    /// View count field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub view_count: Option<String>,
}
