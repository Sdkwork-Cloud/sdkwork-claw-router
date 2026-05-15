use serde::{Deserialize, Serialize};

use crate::models::{AdminAppConfigStandard, AdminAppPortalConfig};

/// Admin app config schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppConfig {
    /// Portal field on admin app config.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub portal: Option<AdminAppPortalConfig>,

    /// Standard field on admin app config.
    pub standard: AdminAppConfigStandard,
}
