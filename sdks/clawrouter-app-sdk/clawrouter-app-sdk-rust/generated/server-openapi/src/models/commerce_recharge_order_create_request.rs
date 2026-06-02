use serde::{Deserialize, Serialize};

/// Commerce recharge order create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRechargeOrderCreateRequest {
    /// Amount field on commerce recharge order create request.
    pub amount: String,

    /// Client request no field on commerce recharge order create request.
    #[serde(rename = "clientRequestNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_request_no: Option<String>,

    /// Currency code field on commerce recharge order create request.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Package id field on commerce recharge order create request.
    #[serde(rename = "packageId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_id: Option<String>,

    /// Source field on commerce recharge order create request.
    pub source: String,
}
