use serde::{Deserialize, Serialize};

use crate::models::{NoData};

/// Base Claw Router response envelope. Operation-specific Result schemas carry concrete business data.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusApiResult {
    /// Business response code.
    pub code: String,

    /// Default empty data payload for the base response envelope.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<NoData>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
