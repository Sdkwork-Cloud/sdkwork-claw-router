use serde::{Deserialize, Serialize};

/// Commerce wallet command request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceWalletCommandRequest {
    /// Amount field on commerce wallet command request.
    pub amount: String,

    /// Asset type field on commerce wallet command request.
    #[serde(rename = "assetType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_type: Option<String>,

    /// Remarks field on commerce wallet command request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remarks: Option<String>,

    /// Request no field on commerce wallet command request.
    #[serde(rename = "requestNo")]
    pub request_no: String,
}
