use serde::{Deserialize, Serialize};

/// Commerce recharge package record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargePackageRecord {
    /// Bonus points field on commerce recharge package record.
    pub bonus_points: String,

    /// Created at field on commerce recharge package record.
    pub created_at: String,

    /// Currency code field on commerce recharge package record.
    pub currency_code: String,

    /// External id field on commerce recharge package record.
    pub external_id: String,

    /// Id field on commerce recharge package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce recharge package record.
    pub idempotency_key: String,

    /// Name field on commerce recharge package record.
    pub name: String,

    /// Organization id field on commerce recharge package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Package no field on commerce recharge package record.
    pub package_no: String,

    /// Price amount field on commerce recharge package record.
    pub price_amount: String,

    /// Request no field on commerce recharge package record.
    pub request_no: String,

    /// Sku id field on commerce recharge package record.
    pub sku_id: String,

    /// Sort weight field on commerce recharge package record.
    pub sort_weight: String,

    /// Status field on commerce recharge package record.
    pub status: String,

    /// Tenant id field on commerce recharge package record.
    pub tenant_id: String,

    /// Updated at field on commerce recharge package record.
    pub updated_at: String,

    /// Valid from field on commerce recharge package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub valid_from: Option<String>,

    /// Valid to field on commerce recharge package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub valid_to: Option<String>,
}
