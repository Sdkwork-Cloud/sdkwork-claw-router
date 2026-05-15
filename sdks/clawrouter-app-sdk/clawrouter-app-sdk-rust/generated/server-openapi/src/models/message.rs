use serde::{Deserialize, Serialize};

/// Message schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Message {
    /// Content field on message.
    pub content: String,

    /// User-facing short notification summary.
    pub desc: String,

    /// Id field on message.
    pub id: String,

    /// Read field on message.
    pub read: bool,

    /// Time field on message.
    pub time: String,

    /// Title field on message.
    pub title: String,

    /// Type field on message.
    pub r#type: String,
}
