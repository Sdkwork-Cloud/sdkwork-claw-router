use serde::{Deserialize, Serialize};

/// Commerce vip privilege speed up request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipPrivilegeSpeedUpRequest {
    /// Privilege code field on commerce vip privilege speed up request.
    #[serde(rename = "privilegeCode")]
    pub privilege_code: String,

    /// Remarks field on commerce vip privilege speed up request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remarks: Option<String>,

    /// Request no field on commerce vip privilege speed up request.
    #[serde(rename = "requestNo")]
    pub request_no: String,
}
