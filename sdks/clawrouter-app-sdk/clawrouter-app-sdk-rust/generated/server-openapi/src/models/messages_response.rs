use serde::{Deserialize, Serialize};

use crate::models::{Message};

/// Messages response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagesResponse {
    /// Items field on messages response.
    pub items: Vec<Message>,
}
