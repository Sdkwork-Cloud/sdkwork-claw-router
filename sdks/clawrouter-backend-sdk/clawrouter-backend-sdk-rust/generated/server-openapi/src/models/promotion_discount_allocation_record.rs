use serde::{Deserialize, Serialize};

/// Promotion discount allocation record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionDiscountAllocationRecord {
    /// Allocation amount minor field on promotion discount allocation record.
    pub allocation_amount_minor: String,

    /// Allocation ratio bps field on promotion discount allocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub allocation_ratio_bps: Option<i64>,

    /// Application id field on promotion discount allocation record.
    pub application_id: String,

    /// Created at field on promotion discount allocation record.
    pub created_at: String,

    /// Currency code field on promotion discount allocation record.
    pub currency_code: String,

    /// Id field on promotion discount allocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Order id field on promotion discount allocation record.
    pub order_id: String,

    /// Order item id field on promotion discount allocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub order_item_id: Option<String>,

    /// Organization id field on promotion discount allocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Sku id field on promotion discount allocation record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sku_id: Option<String>,

    /// Tenant id field on promotion discount allocation record.
    pub tenant_id: String,
}
