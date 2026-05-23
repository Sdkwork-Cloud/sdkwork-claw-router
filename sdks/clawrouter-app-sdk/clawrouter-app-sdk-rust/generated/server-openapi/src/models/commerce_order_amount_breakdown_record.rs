use serde::{Deserialize, Serialize};

/// Commerce order amount breakdown record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceOrderAmountBreakdownRecord {
    /// Created at field on commerce order amount breakdown record.
    pub created_at: String,

    /// Currency code field on commerce order amount breakdown record.
    pub currency_code: String,

    /// Discount amount field on commerce order amount breakdown record.
    pub discount_amount: String,

    /// Order id field on commerce order amount breakdown record.
    pub order_id: String,

    /// Original amount field on commerce order amount breakdown record.
    pub original_amount: String,

    /// Payable amount field on commerce order amount breakdown record.
    pub payable_amount: String,

    /// Tenant id field on commerce order amount breakdown record.
    pub tenant_id: String,
}
