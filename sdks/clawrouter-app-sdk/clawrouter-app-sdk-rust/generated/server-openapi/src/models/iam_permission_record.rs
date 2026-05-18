use serde::{Deserialize, Serialize};

/// Iam permission record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamPermissionRecord {
    /// Action field on iam permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action: Option<String>,

    /// Code field on iam permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Created at field on iam permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on iam permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Name field on iam permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Resource field on iam permission record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resource: Option<String>,
}
