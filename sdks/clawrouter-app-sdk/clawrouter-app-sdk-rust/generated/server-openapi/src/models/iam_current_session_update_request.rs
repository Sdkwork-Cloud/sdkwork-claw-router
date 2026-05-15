use serde::{Deserialize, Serialize};

/// Iam current session update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamCurrentSessionUpdateRequest {
    /// Device name field on iam current session update request.
    #[serde(rename = "deviceName")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_name: Option<String>,

    /// Organization code field on iam current session update request.
    #[serde(rename = "organizationCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_code: Option<String>,

    /// Organization id field on iam current session update request.
    #[serde(rename = "organizationId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,
}
