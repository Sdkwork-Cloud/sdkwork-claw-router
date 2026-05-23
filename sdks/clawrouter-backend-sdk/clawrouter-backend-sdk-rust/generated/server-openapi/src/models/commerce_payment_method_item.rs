use serde::{Deserialize, Serialize};

/// Commerce payment method item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentMethodItem {
    /// Checkout scenes field on commerce payment method item.
    #[serde(rename = "checkoutScenes")]
    pub checkout_scenes: Vec<String>,

    /// Created at field on commerce payment method item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Display name field on commerce payment method item.
    #[serde(rename = "displayName")]
    pub display_name: String,

    /// Id field on commerce payment method item.
    pub id: String,

    /// Method code field on commerce payment method item.
    #[serde(rename = "methodCode")]
    pub method_code: String,

    /// Method type field on commerce payment method item.
    #[serde(rename = "methodType")]
    pub method_type: String,

    /// Provider code field on commerce payment method item.
    #[serde(rename = "providerCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Sort order field on commerce payment method item.
    #[serde(rename = "sortOrder")]
    pub sort_order: i64,

    /// Status field on commerce payment method item.
    pub status: String,

    /// Updated at field on commerce payment method item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
