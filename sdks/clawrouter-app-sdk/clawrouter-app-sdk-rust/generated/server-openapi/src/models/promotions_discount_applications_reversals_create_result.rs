use serde::{Deserialize, Serialize};

use crate::models::{PromotionOperationResponse};

/// Promotions discount applications reversals create result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionsDiscountApplicationsReversalsCreateResult {
    /// Business response code.
    pub code: String,

    /// Data field on promotions discount applications reversals create result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<PromotionOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
