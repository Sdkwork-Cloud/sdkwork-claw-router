use serde::{Deserialize, Serialize};

/// Plus content vote record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusContentVoteRecord {
    /// Client ip field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip: Option<String>,

    /// Device info field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_info: Option<String>,

    /// Source field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,

    /// User id field on plus content vote record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
}
