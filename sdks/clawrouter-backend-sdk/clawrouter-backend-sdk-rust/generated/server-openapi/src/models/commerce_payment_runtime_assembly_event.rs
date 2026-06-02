use serde::{Deserialize, Serialize};

/// Commerce payment runtime assembly event schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentRuntimeAssemblyEvent {
    /// Account no field on commerce payment runtime assembly event.
    #[serde(rename = "accountNo")]
    pub account_no: String,

    /// Kind field on commerce payment runtime assembly event.
    pub kind: String,

    /// Message field on commerce payment runtime assembly event.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Provider code field on commerce payment runtime assembly event.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Reason field on commerce payment runtime assembly event.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,
}
