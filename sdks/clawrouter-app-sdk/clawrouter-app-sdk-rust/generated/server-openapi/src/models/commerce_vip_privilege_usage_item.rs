use serde::{Deserialize, Serialize};

/// Commerce vip privilege usage item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipPrivilegeUsageItem {
    /// Period key field on commerce vip privilege usage item.
    #[serde(rename = "periodKey")]
    pub period_key: String,

    /// Privilege code field on commerce vip privilege usage item.
    #[serde(rename = "privilegeCode")]
    pub privilege_code: String,

    /// Quota count field on commerce vip privilege usage item.
    #[serde(rename = "quotaCount")]
    pub quota_count: i64,

    /// Used count field on commerce vip privilege usage item.
    #[serde(rename = "usedCount")]
    pub used_count: i64,
}
