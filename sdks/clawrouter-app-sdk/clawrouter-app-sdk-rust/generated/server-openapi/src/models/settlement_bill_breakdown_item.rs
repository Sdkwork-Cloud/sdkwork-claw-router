use serde::{Deserialize, Serialize};

/// Settlement bill breakdown item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SettlementBillBreakdownItem {
    /// Cost field on settlement bill breakdown item.
    pub cost: String,

    /// Models field on settlement bill breakdown item.
    pub models: Vec<String>,

    /// Usage field on settlement bill breakdown item.
    pub usage: String,
}
