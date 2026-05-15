use serde::{Deserialize, Serialize};

/// Iam user login event record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamUserLoginEventRecord {
    /// Auth method field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_method: Option<String>,

    /// Auth provider field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_provider: Option<String>,

    /// Client ip hash field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_hash: Option<String>,

    /// Client ip masked field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_masked: Option<String>,

    /// Client ip region field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub client_ip_region: Option<String>,

    /// Created at field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Device fingerprint hash field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_fingerprint_hash: Option<String>,

    /// Device label field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_label: Option<String>,

    /// Failure reason code field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_reason_code: Option<String>,

    /// Id field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Legal hold field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Login result field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub login_result: Option<String>,

    /// Metadata field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Mfa verified field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mfa_verified: Option<bool>,

    /// Occurred at field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub occurred_at: Option<String>,

    /// Organization id field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Request id field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Risk level field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Session id hash field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub session_id_hash: Option<String>,

    /// Status field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User agent hash field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_agent_hash: Option<String>,

    /// User id field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on iam user login event record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
