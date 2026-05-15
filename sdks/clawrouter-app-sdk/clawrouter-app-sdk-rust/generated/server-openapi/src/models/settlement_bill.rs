use serde::{Deserialize, Serialize};

use crate::models::{SettlementBillBreakdown};

/// Settlement bill schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SettlementBill {
    /// Breakdown field on settlement bill.
    pub breakdown: SettlementBillBreakdown,

    /// End date field on settlement bill.
    #[serde(rename = "endDate")]
    pub end_date: String,

    /// Id field on settlement bill.
    pub id: String,

    /// Period field on settlement bill.
    pub period: String,

    /// Start date field on settlement bill.
    #[serde(rename = "startDate")]
    pub start_date: String,

    /// Status field on settlement bill.
    pub status: String,

    /// Total cost field on settlement bill.
    #[serde(rename = "totalCost")]
    pub total_cost: String,

    /// Total tokens field on settlement bill.
    #[serde(rename = "totalTokens")]
    pub total_tokens: String,
}
