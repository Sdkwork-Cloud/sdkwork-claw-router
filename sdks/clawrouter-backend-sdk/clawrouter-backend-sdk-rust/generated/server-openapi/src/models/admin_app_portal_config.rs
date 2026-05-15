use serde::{Deserialize, Serialize};

/// Admin app portal config schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppPortalConfig {
    /// Market status field on admin app portal config.
    #[serde(rename = "marketStatus")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub market_status: Option<String>,
}
