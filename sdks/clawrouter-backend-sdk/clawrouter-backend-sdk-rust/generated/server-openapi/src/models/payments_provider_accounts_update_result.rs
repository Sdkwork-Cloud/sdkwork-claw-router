use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentProviderAccountMutationResponse};

/// Payments provider accounts update result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsProviderAccountsUpdateResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments provider accounts update result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentProviderAccountMutationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
