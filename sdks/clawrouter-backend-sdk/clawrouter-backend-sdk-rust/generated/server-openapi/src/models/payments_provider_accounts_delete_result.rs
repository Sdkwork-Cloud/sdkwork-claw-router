use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentProviderAccountDeleteResponse};

/// Payments provider accounts delete result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsProviderAccountsDeleteResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments provider accounts delete result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentProviderAccountDeleteResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
