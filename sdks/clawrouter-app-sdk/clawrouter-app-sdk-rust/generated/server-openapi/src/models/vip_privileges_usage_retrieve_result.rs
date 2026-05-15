use serde::{Deserialize, Serialize};

use crate::models::{CommerceVipPrivilegeUsageItem};

/// Vip privileges usage retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct VipPrivilegesUsageRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on vip privileges usage retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<Vec<CommerceVipPrivilegeUsageItem>>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
