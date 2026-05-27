use serde::{Deserialize, Serialize};

use crate::models::{PromotionOperationResponse};

/// Promotions discount applications release result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionsDiscountApplicationsReleaseResult {
    /// Business response code.
    pub code: String,

    /// Data field on promotions discount applications release result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<PromotionOperationResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
