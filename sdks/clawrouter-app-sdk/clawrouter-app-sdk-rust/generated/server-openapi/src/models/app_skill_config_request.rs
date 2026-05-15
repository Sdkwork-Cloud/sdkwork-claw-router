use serde::{Deserialize, Serialize};

/// Skill runtime configuration request. config.portal is reserved portal metadata and must not be provided by clients.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppSkillConfigRequest {
    /// Optional config wrapper. When omitted, the whole request object is treated as skill config. config.portal is reserved portal metadata and must not be provided by clients.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub config: Option<std::collections::HashMap<String, String>>,
}
