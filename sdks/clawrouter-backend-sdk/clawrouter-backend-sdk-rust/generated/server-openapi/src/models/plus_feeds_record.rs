use serde::{Deserialize, Serialize};

/// Plus feeds record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusFeedsRecord {
    /// Author field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author: Option<std::collections::HashMap<String, String>>,

    /// Cover images field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover_images: Option<std::collections::HashMap<String, String>>,

    /// Publish time field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub publish_time: Option<String>,

    /// Resource list field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource_list: Option<std::collections::HashMap<String, String>>,

    /// Source field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,

    /// Source url field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_url: Option<String>,

    /// Summary field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<std::collections::HashMap<String, String>>,

    /// User id field on plus feeds record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
