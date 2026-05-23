use serde::{Deserialize, Serialize};

/// Feeds collections current retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct FeedsCollectionsCurrentRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on feeds collections current retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<bool>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
