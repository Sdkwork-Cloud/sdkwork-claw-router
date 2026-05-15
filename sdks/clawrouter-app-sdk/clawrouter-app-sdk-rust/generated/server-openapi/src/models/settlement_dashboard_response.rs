use serde::{Deserialize, Serialize};

use crate::models::{SettlementBill, SettlementChartPoint};

/// Settlement dashboard response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SettlementDashboardResponse {
    /// Bills field on settlement dashboard response.
    pub bills: Vec<SettlementBill>,

    /// Chart data field on settlement dashboard response.
    #[serde(rename = "chartData")]
    pub chart_data: Vec<SettlementChartPoint>,
}
