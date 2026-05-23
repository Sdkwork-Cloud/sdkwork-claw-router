use serde::{Deserialize, Serialize};

/// Notification item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct NotificationItem {
    /// Action url field on notification item.
    #[serde(rename = "actionUrl")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action_url: Option<String>,

    /// App id field on notification item.
    #[serde(rename = "appId")]
    pub app_id: String,

    /// Archived field on notification item.
    pub archived: bool,

    /// Content field on notification item.
    pub content: String,

    /// User-facing short notification summary.
    pub desc: String,

    /// Id field on notification item.
    pub id: String,

    /// Server-side per-user state indicating that the popup has already been presented for this app.
    #[serde(rename = "popupSeen")]
    pub popup_seen: bool,

    /// Read field on notification item.
    pub read: bool,

    /// Whether this notification should be displayed as a modal popup when the frontend loads.
    #[serde(rename = "showAsPopup")]
    pub show_as_popup: bool,

    /// Time field on notification item.
    pub time: String,

    /// Title field on notification item.
    pub title: String,

    /// Type field on notification item.
    pub r#type: String,
}
