use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentProviderAccountListResponse};

/// Payments provider accounts list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsProviderAccountsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments provider accounts list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentProviderAccountListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
