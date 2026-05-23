use serde::{Deserialize, Serialize};

use crate::models::{CommerceProductSpuItem};

/// Commerce product spu list response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSpuListResponse {
    /// Items field on commerce product spu list response.
    pub items: Vec<CommerceProductSpuItem>,

    /// Page field on commerce product spu list response.
    pub page: i64,

    /// Page size field on commerce product spu list response.
    #[serde(rename = "pageSize")]
    pub page_size: i64,

    /// Total field on commerce product spu list response.
    pub total: i64,
}
