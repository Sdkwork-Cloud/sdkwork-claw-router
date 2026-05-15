use serde::{Deserialize, Serialize};

/// Admin app config standard schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminAppConfigStandard {
    /// Stable PlusApp identity key. Must use lowercase kebab-case.
    #[serde(rename = "appKey")]
    pub app_key: String,
}
