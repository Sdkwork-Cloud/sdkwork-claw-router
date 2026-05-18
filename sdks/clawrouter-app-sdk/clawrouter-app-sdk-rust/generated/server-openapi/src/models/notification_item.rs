use serde::{Deserialize, Serialize};

/// Notification item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct NotificationItem {
    /// Content field on notification item.
    pub content: String,

    /// User-facing short notification summary.
    pub desc: String,

    /// Id field on notification item.
    pub id: String,

    /// Read field on notification item.
    pub read: bool,

    /// Whether this notification should be displayed as a modal popup when the frontend loads.
    #[serde(rename = "showAsPopup")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub show_as_popup: Option<bool>,

    /// Time field on notification item.
    pub time: String,

    /// Title field on notification item.
    pub title: String,

    /// Type field on notification item.
    pub r#type: String,
}
