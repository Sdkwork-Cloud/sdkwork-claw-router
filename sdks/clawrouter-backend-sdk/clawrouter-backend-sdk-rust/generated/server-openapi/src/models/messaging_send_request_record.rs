use serde::{Deserialize, Serialize};

/// Messaging send request record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingSendRequestRecord {
    /// Accepted at field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub accepted_at: Option<String>,

    /// App id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Channel field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel: Option<String>,

    /// Created at field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Delivered at field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivered_at: Option<String>,

    /// Delivery purpose field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_purpose: Option<String>,

    /// Delivery status field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_status: Option<String>,

    /// Dry run field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub dry_run: Option<bool>,

    /// Expires at field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,

    /// Failed at field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failed_at: Option<String>,

    /// Id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_key: Option<String>,

    /// Legal hold field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Metadata field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload hash field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Render hash field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub render_hash: Option<String>,

    /// Request id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Request no field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_no: Option<String>,

    /// Request payload redacted field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_payload_redacted: Option<std::collections::HashMap<String, String>>,

    /// Resolved provider account id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_provider_account_id: Option<String>,

    /// Resolved route rule id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_route_rule_id: Option<String>,

    /// Resolved sender identity id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolved_sender_identity_id: Option<String>,

    /// Retention until field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Scene code field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scene_code: Option<String>,

    /// Scheduled at field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scheduled_at: Option<String>,

    /// Sent at field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sent_at: Option<String>,

    /// Status field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target hash field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_hash: Option<String>,

    /// Target masked field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_masked: Option<String>,

    /// Target type field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Template variant id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_variant_id: Option<String>,

    /// Template version id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub template_version_id: Option<String>,

    /// Tenant id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Trace id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on messaging send request record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
