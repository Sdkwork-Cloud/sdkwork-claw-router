use serde::{Deserialize, Serialize};

use crate::models::{ForumOverviewResponse};

/// Feeds overview retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct FeedsOverviewRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on feeds overview retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<ForumOverviewResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
