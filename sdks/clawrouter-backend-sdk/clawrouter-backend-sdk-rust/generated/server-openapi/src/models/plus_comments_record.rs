use serde::{Deserialize, Serialize};

/// Plus comments record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusCommentsRecord {
    /// Author field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub author: Option<std::collections::HashMap<String, String>>,

    /// Device info field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_info: Option<String>,

    /// Ip address field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_address: Option<String>,

    /// Parent id field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// User id field on plus comments record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
