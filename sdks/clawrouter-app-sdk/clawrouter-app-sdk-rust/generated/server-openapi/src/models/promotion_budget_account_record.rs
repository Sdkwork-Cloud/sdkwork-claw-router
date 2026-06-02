use serde::{Deserialize, Serialize};

/// Promotion budget account record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionBudgetAccountRecord {
    /// Available amount minor field on promotion budget account record.
    pub available_amount_minor: String,

    /// Available quantity field on promotion budget account record.
    pub available_quantity: String,

    /// Budget no field on promotion budget account record.
    pub budget_no: String,

    /// Budget type field on promotion budget account record.
    pub budget_type: String,

    /// Consumed amount minor field on promotion budget account record.
    pub consumed_amount_minor: String,

    /// Consumed quantity field on promotion budget account record.
    pub consumed_quantity: String,

    /// Created at field on promotion budget account record.
    pub created_at: String,

    /// Created by field on promotion budget account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>,

    /// Currency code field on promotion budget account record.
    pub currency_code: String,

    /// Id field on promotion budget account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Lock mode field on promotion budget account record.
    pub lock_mode: String,

    /// Offer id field on promotion budget account record.
    pub offer_id: String,

    /// Offer version id field on promotion budget account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub offer_version_id: Option<String>,

    /// Organization id field on promotion budget account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Overrun amount minor field on promotion budget account record.
    pub overrun_amount_minor: String,

    /// Planned amount minor field on promotion budget account record.
    pub planned_amount_minor: String,

    /// Reserved amount minor field on promotion budget account record.
    pub reserved_amount_minor: String,

    /// Reserved quantity field on promotion budget account record.
    pub reserved_quantity: String,

    /// Status field on promotion budget account record.
    pub status: String,

    /// Stock id field on promotion budget account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub stock_id: Option<String>,

    /// Tenant id field on promotion budget account record.
    pub tenant_id: String,

    /// Total amount minor field on promotion budget account record.
    pub total_amount_minor: String,

    /// Total quantity field on promotion budget account record.
    pub total_quantity: String,

    /// Updated at field on promotion budget account record.
    pub updated_at: String,

    /// Updated by field on promotion budget account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,
}
