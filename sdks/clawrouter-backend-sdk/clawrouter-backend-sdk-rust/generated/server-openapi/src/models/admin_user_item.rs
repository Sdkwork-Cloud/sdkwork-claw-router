use serde::{Deserialize, Serialize};

/// Persisted admin user snapshot returned by the backend.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminUserItem {
    /// Balance field on admin user item.
    pub balance: String,

    /// Created at field on admin user item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Email field on admin user item.
    pub email: String,

    /// Group field on admin user item.
    pub group: String,

    /// Id field on admin user item.
    pub id: i64,

    /// Last active field on admin user item.
    #[serde(rename = "lastActive")]
    pub last_active: String,

    /// Last used field on admin user item.
    #[serde(rename = "lastUsed")]
    pub last_used: String,

    /// Role field on admin user item.
    pub role: String,

    /// Status field on admin user item.
    pub status: String,

    /// Username field on admin user item.
    pub username: String,
}
