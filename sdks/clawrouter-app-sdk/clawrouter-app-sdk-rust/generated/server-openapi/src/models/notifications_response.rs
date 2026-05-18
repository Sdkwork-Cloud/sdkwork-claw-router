use serde::{Deserialize, Serialize};

use crate::models::{NotificationItem};

/// Notifications response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct NotificationsResponse {
    /// Items field on notifications response.
    pub items: Vec<NotificationItem>,
}
