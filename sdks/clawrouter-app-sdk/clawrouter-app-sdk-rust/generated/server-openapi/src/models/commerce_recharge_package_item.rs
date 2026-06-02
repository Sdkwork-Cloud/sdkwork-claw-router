use serde::{Deserialize, Serialize};

/// Commerce recharge package item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargePackageItem {
    /// Bonus points field on commerce recharge package item.
    #[serde(rename = "bonusPoints")]
    pub bonus_points: i64,

    /// Currency code field on commerce recharge package item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Grant amount field on commerce recharge package item.
    #[serde(rename = "grantAmount")]
    pub grant_amount: i64,

    /// Id field on commerce recharge package item.
    pub id: String,

    /// Name field on commerce recharge package item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Package no field on commerce recharge package item.
    #[serde(rename = "packageNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_no: Option<String>,

    /// Points field on commerce recharge package item.
    pub points: i64,

    /// Price amount field on commerce recharge package item.
    #[serde(rename = "priceAmount")]
    pub price_amount: String,

    /// Sku id field on commerce recharge package item.
    #[serde(rename = "skuId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sku_id: Option<String>,

    /// Status field on commerce recharge package item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Updated at field on commerce recharge package item.
    #[serde(rename = "updatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}
