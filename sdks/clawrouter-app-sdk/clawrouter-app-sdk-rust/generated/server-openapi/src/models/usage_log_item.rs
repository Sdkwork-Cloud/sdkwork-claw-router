use serde::{Deserialize, Serialize};

/// Usage log item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct UsageLogItem {
    /// Base input price field on usage log item.
    #[serde(rename = "baseInputPrice")]
    pub base_input_price: String,

    /// Base output price field on usage log item.
    #[serde(rename = "baseOutputPrice")]
    pub base_output_price: String,

    /// Cache read price field on usage log item.
    #[serde(rename = "cacheReadPrice")]
    pub cache_read_price: String,

    /// Cache read tokens field on usage log item.
    #[serde(rename = "cacheReadTokens")]
    pub cache_read_tokens: i64,

    /// Cost field on usage log item.
    pub cost: String,

    /// Group field on usage log item.
    pub group: String,

    /// Id field on usage log item.
    pub id: String,

    /// Input tokens field on usage log item.
    #[serde(rename = "inputTokens")]
    pub input_tokens: i64,

    /// Ip field on usage log item.
    pub ip: String,

    /// Is stream field on usage log item.
    #[serde(rename = "isStream")]
    pub is_stream: bool,

    /// Model field on usage log item.
    pub model: String,

    /// Multiplier field on usage log item.
    pub multiplier: String,

    /// Output tokens field on usage log item.
    #[serde(rename = "outputTokens")]
    pub output_tokens: i64,

    /// Path field on usage log item.
    pub path: String,

    /// Reasoning effort field on usage log item.
    #[serde(rename = "reasoningEffort")]
    pub reasoning_effort: String,

    /// Request id field on usage log item.
    #[serde(rename = "requestId")]
    pub request_id: String,

    /// Time field on usage log item.
    pub time: String,

    /// Token name field on usage log item.
    #[serde(rename = "tokenName")]
    pub token_name: String,

    /// Total time field on usage log item.
    #[serde(rename = "totalTime")]
    pub total_time: String,

    /// Ttft field on usage log item.
    pub ttft: String,

    /// Type field on usage log item.
    pub r#type: String,
}
