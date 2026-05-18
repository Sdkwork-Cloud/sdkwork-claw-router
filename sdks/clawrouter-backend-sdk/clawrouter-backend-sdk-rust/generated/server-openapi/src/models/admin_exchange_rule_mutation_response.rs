use serde::{Deserialize, Serialize};

use crate::models::{CommerceExchangeRuleItem};

/// Admin exchange rule mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminExchangeRuleMutationResponse {
    /// Item field on admin exchange rule mutation response.
    pub item: CommerceExchangeRuleItem,
}
