use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentRouteRuleListResponse};

/// Payments route rules list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PaymentsRouteRulesListResult {
    /// Business response code.
    pub code: String,

    /// Data field on payments route rules list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommercePaymentRouteRuleListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
