use serde::{Deserialize, Serialize};

/// App model catalog reference price schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppModelCatalogReferencePrice {
    /// Billing meter field on app model catalog reference price.
    #[serde(rename = "billingMeter")]
    pub billing_meter: String,

    /// Currency field on app model catalog reference price.
    pub currency: String,

    /// Deployment or pricing region for this public reference price. Region is never encoded in catalogKey.
    #[serde(rename = "regionCode")]
    pub region_code: String,

    /// Decimal unit price in the native official reference currency.
    #[serde(rename = "unitPrice")]
    pub unit_price: String,
}
