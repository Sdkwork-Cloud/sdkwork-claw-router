use serde::{Deserialize, Serialize};

/// Iam verification attempt record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamVerificationAttemptRecord {
    /// Challenge id field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub challenge_id: Option<String>,

    /// Created at field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Device hash field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_hash: Option<String>,

    /// Failure reason field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_reason: Option<String>,

    /// Id field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Ip hash field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ip_hash: Option<String>,

    /// Legal hold field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Occurred at field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub occurred_at: Option<String>,

    /// Organization id field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Result field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub result: Option<String>,

    /// Retention until field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Risk snapshot field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_snapshot: Option<std::collections::HashMap<String, String>>,

    /// Scene code field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scene_code: Option<String>,

    /// Status field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target hash field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_hash: Option<String>,

    /// Target type field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Tenant id field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on iam verification attempt record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
