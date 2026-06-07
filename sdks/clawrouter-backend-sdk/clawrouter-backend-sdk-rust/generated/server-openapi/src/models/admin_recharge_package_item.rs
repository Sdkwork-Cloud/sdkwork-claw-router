use serde::{Deserialize, Serialize};

/// Admin recharge package item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminRechargePackageItem {
    /// Bonus points field on admin recharge package item.
    #[serde(rename = "bonusPoints")]
    pub bonus_points: String,

    /// Currency code field on admin recharge package item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Grant amount field on admin recharge package item.
    #[serde(rename = "grantAmount")]
    pub grant_amount: String,

    /// Id field on admin recharge package item.
    pub id: String,

    /// Name field on admin recharge package item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Package no field on admin recharge package item.
    #[serde(rename = "packageNo")]
    pub package_no: String,

    /// Points field on admin recharge package item.
    pub points: String,

    /// Price amount field on admin recharge package item.
    #[serde(rename = "priceAmount")]
    pub price_amount: String,

    /// Sku id field on admin recharge package item.
    #[serde(rename = "skuId")]
    pub sku_id: String,

    /// Status field on admin recharge package item.
    pub status: String,

    /// Updated at field on admin recharge package item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
