use serde::{Deserialize, Serialize};

/// Dashboard announcement schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct DashboardAnnouncement {
    /// Id field on dashboard announcement.
    pub id: i64,

    /// Text field on dashboard announcement.
    pub text: String,

    /// Time field on dashboard announcement.
    pub time: String,

    /// Type field on dashboard announcement.
    pub r#type: String,
}
