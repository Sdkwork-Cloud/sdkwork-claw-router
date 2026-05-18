use serde::{Deserialize, Serialize};

/// Iam device record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamDeviceRecord {
    /// Created at field on iam device record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Device fingerprint field on iam device record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_fingerprint: Option<String>,

    /// Id field on iam device record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last seen at field on iam device record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_seen_at: Option<String>,

    /// Name field on iam device record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Tenant id field on iam device record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trusted field on iam device record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trusted: Option<bool>,

    /// User id field on iam device record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
