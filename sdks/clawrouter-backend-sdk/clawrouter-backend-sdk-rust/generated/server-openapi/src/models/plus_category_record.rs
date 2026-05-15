use serde::{Deserialize, Serialize};

/// Plus category record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusCategoryRecord {
    /// Code field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Description field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Group name field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_name: Option<String>,

    /// Icon field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,

    /// Parent id field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Shop id field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub shop_id: Option<String>,
}
