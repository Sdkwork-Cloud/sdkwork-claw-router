use serde::{Deserialize, Serialize};

/// Commerce standard collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceStandardCollectionResponse {
    /// Items field on commerce standard collection response.
    pub items: Vec<serde_json::Value>,

    /// Page field on commerce standard collection response.
    pub page: i64,

    /// Page size field on commerce standard collection response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce standard collection response.
    pub total: i64,
}
