use serde::{Deserialize, Serialize};

use crate::models::{NotificationsResponse};

/// Notifications list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct NotificationsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on notifications list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<NotificationsResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
