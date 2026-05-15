use serde::{Deserialize, Serialize};

/// Commerce vip pack group item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipPackGroupItem {
    /// Code field on commerce vip pack group item.
    pub code: String,

    /// Id field on commerce vip pack group item.
    pub id: String,

    /// Name field on commerce vip pack group item.
    pub name: String,

    /// Sort order field on commerce vip pack group item.
    #[serde(rename = "sortOrder")]
    pub sort_order: i64,

    /// Status field on commerce vip pack group item.
    pub status: String,
}
