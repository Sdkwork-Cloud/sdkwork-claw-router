use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Plus category record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusCategoryRecord {
    /// Code field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,

    /// Created at field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Description field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Group name field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_name: Option<String>,

    /// Icon field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Id field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Name field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Parent id field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,

    /// Shop id field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub shop_id: Option<String>,

    /// Sort weight field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Status field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<i64>,

    /// Tags field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Type field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub r#type: Option<i64>,

    /// Updated at field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,

    /// Visible field on plus category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub visible: Option<bool>,
}
