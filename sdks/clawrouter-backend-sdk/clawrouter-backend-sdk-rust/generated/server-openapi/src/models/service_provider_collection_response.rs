use serde::{Deserialize, Serialize};

/// Service provider collection response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ServiceProviderCollectionResponse {
    /// Items field on service provider collection response.
    pub items: Vec<std::collections::HashMap<String, String>>,

    /// Page field on service provider collection response.
    pub page: i64,

    /// Page size field on service provider collection response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on service provider collection response.
    pub total: i64,
}
