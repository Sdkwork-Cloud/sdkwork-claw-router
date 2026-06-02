use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Iam user record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamUserRecord {
    /// Avatar field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub avatar: Option<MediaResource>,

    /// Created at field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Display name field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Email field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,

    /// Id field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Phone field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub phone: Option<String>,

    /// Status field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Username field on iam user record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
}
