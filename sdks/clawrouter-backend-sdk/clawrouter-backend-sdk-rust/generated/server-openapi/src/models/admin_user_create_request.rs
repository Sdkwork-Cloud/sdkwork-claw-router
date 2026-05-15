use serde::{Deserialize, Serialize};

/// Admin user create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminUserCreateRequest {
    /// Initial account balance decimal string accepted by the admin user API.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub balance: Option<String>,

    /// User email address.
    pub email: String,

    /// Optional display name. Backend defaults to the email local-part when omitted.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
}
