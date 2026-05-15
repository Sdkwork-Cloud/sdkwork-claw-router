use serde::{Deserialize, Serialize};

use crate::models::{CommerceVipPackItem};

/// Vip packs retrieve result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct VipPacksRetrieveResult {
    /// Business response code.
    pub code: String,

    /// Data field on vip packs retrieve result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceVipPackItem>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    /// Java-compatible response message field.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
