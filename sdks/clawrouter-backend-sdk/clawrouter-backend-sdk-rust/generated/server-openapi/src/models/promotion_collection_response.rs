use serde::{Deserialize, Serialize};

/// Promotion collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionCollectionResponse {
    /// Items field on promotion collection response.
    pub items: Vec<serde_json::Value>,

    /// Page field on promotion collection response.
    pub page: i64,

    /// Page size field on promotion collection response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on promotion collection response.
    pub total: i64,
}
