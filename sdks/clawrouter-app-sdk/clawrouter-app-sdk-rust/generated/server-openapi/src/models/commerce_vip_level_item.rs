use serde::{Deserialize, Serialize};

/// Commerce vip level item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceVipLevelItem {
    /// Code field on commerce vip level item.
    pub code: String,

    /// Id field on commerce vip level item.
    pub id: String,

    /// Name field on commerce vip level item.
    pub name: String,

    /// Rank field on commerce vip level item.
    pub rank: i64,

    /// Status field on commerce vip level item.
    pub status: String,
}
