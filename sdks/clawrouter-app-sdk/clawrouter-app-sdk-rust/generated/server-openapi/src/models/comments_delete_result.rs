use serde::{Deserialize, Serialize};

use crate::models::{NoData};

/// Comments delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommentsDeleteResult {
    /// Business response code.
    pub code: String,

    /// No business data returned by this operation.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<NoData>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
