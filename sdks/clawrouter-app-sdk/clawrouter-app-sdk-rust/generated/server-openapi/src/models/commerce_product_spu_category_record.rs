use serde::{Deserialize, Serialize};

/// Commerce product spu category record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSpuCategoryRecord {
    /// Category id field on commerce product spu category record.
    pub category_id: String,

    /// Created at field on commerce product spu category record.
    pub created_at: String,

    /// Id field on commerce product spu category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce product spu category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Primary flag field on commerce product spu category record.
    pub primary_flag: bool,

    /// Sort order field on commerce product spu category record.
    pub sort_order: String,

    /// Spu id field on commerce product spu category record.
    pub spu_id: String,

    /// Status field on commerce product spu category record.
    pub status: String,

    /// Tenant id field on commerce product spu category record.
    pub tenant_id: String,

    /// Updated at field on commerce product spu category record.
    pub updated_at: String,
}
