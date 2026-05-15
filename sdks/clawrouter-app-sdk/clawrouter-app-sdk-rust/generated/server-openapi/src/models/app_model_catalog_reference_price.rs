use serde::{Deserialize, Serialize};

/// App model catalog reference price schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppModelCatalogReferencePrice {
    /// Billing meter field on app model catalog reference price.
    #[serde(rename = "billingMeter")]
    pub billing_meter: String,

    /// Currency field on app model catalog reference price.
    pub currency: String,

    /// Decimal unit price in the native official reference currency.
    #[serde(rename = "unitPrice")]
    pub unit_price: String,
}
