use serde::{Deserialize, Serialize};

/// Account security summary schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountSecuritySummary {
    /// Ip whitelist count field on account security summary.
    #[serde(rename = "ipWhitelistCount")]
    pub ip_whitelist_count: i64,

    /// Mfa enabled field on account security summary.
    #[serde(rename = "mfaEnabled")]
    pub mfa_enabled: bool,

    /// Qps limit field on account security summary.
    #[serde(rename = "qpsLimit")]
    pub qps_limit: i64,
}
