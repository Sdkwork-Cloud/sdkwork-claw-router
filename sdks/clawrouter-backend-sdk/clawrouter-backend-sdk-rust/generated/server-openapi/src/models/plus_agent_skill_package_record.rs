use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Plus agent skill package record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusAgentSkillPackageRecord {
    /// Category id field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Cover field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub cover: Option<MediaResource>,

    /// Created at field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<i64>,

    /// Description field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Enabled field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,

    /// Featured field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub featured: Option<bool>,

    /// Icon field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Id field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Latest published at field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub latest_published_at: Option<String>,

    /// Name field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Package key field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub package_key: Option<String>,

    /// Sort weight field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_weight: Option<i64>,

    /// Summary field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,

    /// Tags field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tags: Option<std::collections::HashMap<String, String>>,

    /// Tenant id field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// V field on plus agent skill package record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub v: Option<String>,
}
