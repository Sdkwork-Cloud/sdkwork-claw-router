use serde::{Deserialize, Serialize};

/// Admin record log item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRecordLogItem {
    /// Base input price field on admin record log item.
    #[serde(rename = "baseInputPrice")]
    pub base_input_price: String,

    /// Base output price field on admin record log item.
    #[serde(rename = "baseOutputPrice")]
    pub base_output_price: String,

    /// Cache read price field on admin record log item.
    #[serde(rename = "cacheReadPrice")]
    pub cache_read_price: String,

    /// Cache read tokens field on admin record log item.
    #[serde(rename = "cacheReadTokens")]
    pub cache_read_tokens: i64,

    /// Cost field on admin record log item.
    pub cost: String,

    /// Group field on admin record log item.
    pub group: String,

    /// Id field on admin record log item.
    pub id: String,

    /// Input tokens field on admin record log item.
    #[serde(rename = "inputTokens")]
    pub input_tokens: i64,

    /// Ip field on admin record log item.
    pub ip: String,

    /// Is stream field on admin record log item.
    #[serde(rename = "isStream")]
    pub is_stream: bool,

    /// Model field on admin record log item.
    pub model: String,

    /// Multiplier field on admin record log item.
    pub multiplier: String,

    /// Output tokens field on admin record log item.
    #[serde(rename = "outputTokens")]
    pub output_tokens: i64,

    /// Path field on admin record log item.
    pub path: String,

    /// Reasoning effort field on admin record log item.
    #[serde(rename = "reasoningEffort")]
    pub reasoning_effort: String,

    /// Request id field on admin record log item.
    #[serde(rename = "requestId")]
    pub request_id: String,

    /// Time field on admin record log item.
    pub time: String,

    /// Token name field on admin record log item.
    #[serde(rename = "tokenName")]
    pub token_name: String,

    /// Total time field on admin record log item.
    #[serde(rename = "totalTime")]
    pub total_time: String,

    /// Ttft field on admin record log item.
    pub ttft: String,

    /// Type field on admin record log item.
    pub r#type: String,

    /// User field on admin record log item.
    pub user: String,
}
