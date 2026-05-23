use serde::{Deserialize, Serialize};

/// Open platform entry item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformEntryItem {
    /// Account id field on open platform entry item.
    #[serde(rename = "accountId")]
    pub account_id: String,

    /// Created at field on open platform entry item.
    #[serde(rename = "createdAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on open platform entry item.
    pub id: String,

    /// Key field on open platform entry item.
    pub key: String,

    /// Status field on open platform entry item.
    pub status: String,

    /// Type field on open platform entry item.
    pub r#type: String,

    /// Updated at field on open platform entry item.
    #[serde(rename = "updatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Url field on open platform entry item.
    pub url: String,
}
