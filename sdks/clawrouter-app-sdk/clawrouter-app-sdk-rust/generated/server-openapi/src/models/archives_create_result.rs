use serde::{Deserialize, Serialize};

use crate::models::{SdkReferenceArchiveResponse};

/// Archives create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ArchivesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on archives create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<SdkReferenceArchiveResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
