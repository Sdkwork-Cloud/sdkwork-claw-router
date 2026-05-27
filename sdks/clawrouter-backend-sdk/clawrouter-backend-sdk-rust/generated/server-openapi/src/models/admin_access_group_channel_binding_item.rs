use serde::{Deserialize, Serialize};

/// Admin access group channel binding item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAccessGroupChannelBindingItem {
    /// Capabilities field on admin access group channel binding item.
    pub capabilities: Vec<String>,

    /// Channel code field on admin access group channel binding item.
    #[serde(rename = "channelCode")]
    pub channel_code: String,

    /// Channel id field on admin access group channel binding item.
    #[serde(rename = "channelId")]
    pub channel_id: String,

    /// Channel name field on admin access group channel binding item.
    #[serde(rename = "channelName")]
    pub channel_name: String,

    /// Group id field on admin access group channel binding item.
    #[serde(rename = "groupId")]
    pub group_id: String,

    /// Health status field on admin access group channel binding item.
    #[serde(rename = "healthStatus")]
    pub health_status: String,

    /// Id field on admin access group channel binding item.
    pub id: String,

    /// Model scope field on admin access group channel binding item.
    #[serde(rename = "modelScope")]
    pub model_scope: Vec<String>,

    /// Models field on admin access group channel binding item.
    pub models: Vec<String>,

    /// Priority field on admin access group channel binding item.
    pub priority: i64,

    /// Provider code field on admin access group channel binding item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Provider name field on admin access group channel binding item.
    #[serde(rename = "providerName")]
    pub provider_name: String,

    /// Status field on admin access group channel binding item.
    pub status: String,

    /// Weight field on admin access group channel binding item.
    pub weight: i64,
}
