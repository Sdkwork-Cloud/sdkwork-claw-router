use serde::{Deserialize, Serialize};

/// Admin access group channel binding input schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAccessGroupChannelBindingInput {
    /// Capabilities field on admin access group channel binding input.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capabilities: Option<Vec<String>>,

    /// Channel id field on admin access group channel binding input.
    #[serde(rename = "channelId")]
    pub channel_id: String,

    /// Model scope field on admin access group channel binding input.
    #[serde(rename = "modelScope")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model_scope: Option<Vec<String>>,

    /// Priority field on admin access group channel binding input.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Status field on admin access group channel binding input.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Weight field on admin access group channel binding input.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
