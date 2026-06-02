use serde::{Deserialize, Serialize};

/// Iam verification scene policy record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationScenePolicyRecord {
    /// Allowed channels field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub allowed_channels: Option<std::collections::HashMap<String, String>>,

    /// Code charset field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_charset: Option<String>,

    /// Code length field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_length: Option<i64>,

    /// Created at field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default channel field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_channel: Option<String>,

    /// Deleted at field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Max send per hour field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_send_per_hour: Option<i64>,

    /// Max verify attempts field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub max_verify_attempts: Option<i64>,

    /// Metadata field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Resend interval seconds field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resend_interval_seconds: Option<i64>,

    /// Risk policy field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_policy: Option<std::collections::HashMap<String, String>>,

    /// Rollout policy field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rollout_policy: Option<std::collections::HashMap<String, String>>,

    /// Scene code field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scene_code: Option<String>,

    /// Scene name field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scene_name: Option<String>,

    /// Status field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target binding required field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_binding_required: Option<bool>,

    /// Template code field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_code: Option<String>,

    /// Tenant id field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Ttl seconds field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ttl_seconds: Option<i64>,

    /// Updated at field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on iam verification scene policy record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
