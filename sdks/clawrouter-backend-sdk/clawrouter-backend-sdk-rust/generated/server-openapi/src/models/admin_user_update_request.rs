use serde::{Deserialize, Serialize};

/// Admin user update request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminUserUpdateRequest {
    /// Optional user group label update.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group: Option<String>,

    /// User identifier.
    pub id: i64,

    /// Status field on admin user update request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Optional display name update.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
}
