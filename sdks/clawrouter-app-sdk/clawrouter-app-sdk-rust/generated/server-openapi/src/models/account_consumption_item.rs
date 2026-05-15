use serde::{Deserialize, Serialize};

/// Account consumption item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountConsumptionItem {
    /// UI color token selected by the backend from known modality labels.
    pub color: String,

    /// Name field on account consumption item.
    pub name: String,

    /// Percentage field on account consumption item.
    pub percentage: f64,

    /// Value field on account consumption item.
    pub value: f64,
}
