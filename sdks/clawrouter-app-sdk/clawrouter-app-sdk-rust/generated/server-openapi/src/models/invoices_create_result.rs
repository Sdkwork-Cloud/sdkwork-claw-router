use serde::{Deserialize, Serialize};

use crate::models::{CommerceOperationResponse};

/// Invoices create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct InvoicesCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on invoices create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
