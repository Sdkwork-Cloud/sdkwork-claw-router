use serde::{Deserialize, Serialize};

/// Iam verification challenge record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationChallengeRecord {
    /// Consumed at field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consumed_at: Option<String>,

    /// Created at field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Delivery request id field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_request_id: Option<String>,

    /// Id field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Locked until field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub locked_until: Option<String>,

    /// Metadata field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Salt ref field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub salt_ref: Option<String>,

    /// Status field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target masked field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_masked: Option<String>,

    /// Tenant id field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Verified at field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub verified_at: Option<String>,

    /// Version field on iam verification challenge record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
