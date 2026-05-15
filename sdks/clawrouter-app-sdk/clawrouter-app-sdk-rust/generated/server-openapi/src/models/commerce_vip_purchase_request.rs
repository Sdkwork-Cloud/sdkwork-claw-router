use serde::{Deserialize, Serialize};

/// Commerce vip purchase request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipPurchaseRequest {
    /// Pack id field on commerce vip purchase request.
    #[serde(rename = "packId")]
    pub pack_id: String,

    /// Remarks field on commerce vip purchase request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remarks: Option<String>,

    /// Request no field on commerce vip purchase request.
    #[serde(rename = "requestNo")]
    pub request_no: String,
}
