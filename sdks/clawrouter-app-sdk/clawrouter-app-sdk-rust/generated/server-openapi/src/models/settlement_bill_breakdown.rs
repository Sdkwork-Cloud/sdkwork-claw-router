use serde::{Deserialize, Serialize};

use crate::models::{SettlementBillBreakdownItem};

/// Settlement bill breakdown schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SettlementBillBreakdown {
    /// Audio field on settlement bill breakdown.
    pub audio: SettlementBillBreakdownItem,

    /// Image field on settlement bill breakdown.
    pub image: SettlementBillBreakdownItem,

    /// Music field on settlement bill breakdown.
    pub music: SettlementBillBreakdownItem,

    /// Text field on settlement bill breakdown.
    pub text: SettlementBillBreakdownItem,

    /// Video field on settlement bill breakdown.
    pub video: SettlementBillBreakdownItem,
}
