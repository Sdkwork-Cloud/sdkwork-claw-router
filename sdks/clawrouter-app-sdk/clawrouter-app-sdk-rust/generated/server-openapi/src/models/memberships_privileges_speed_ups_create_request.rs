use serde::{Deserialize, Serialize};

/// Closed empty request body for consuming a member speed-up privilege.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MembershipsPrivilegesSpeedUpsCreateRequest {
    #[serde(flatten)]
    pub additional_properties: std::collections::HashMap<String, serde_json::Value>,
}
