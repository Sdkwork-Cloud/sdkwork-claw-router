use serde::{Deserialize, Serialize};

use crate::models::{CommerceStandardResourceResponse};

/// Invoices retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct InvoicesRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on invoices retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceStandardResourceResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
