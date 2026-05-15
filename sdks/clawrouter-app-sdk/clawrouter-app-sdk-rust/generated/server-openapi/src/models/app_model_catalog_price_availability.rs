use serde::{Deserialize, Serialize};

/// App model catalog price availability schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppModelCatalogPriceAvailability {
    /// Reason field on app model catalog price availability.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,

    /// Status field on app model catalog price availability.
    pub status: String,
}
