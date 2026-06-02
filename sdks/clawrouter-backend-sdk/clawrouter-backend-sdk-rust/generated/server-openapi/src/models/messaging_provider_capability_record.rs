use serde::{Deserialize, Serialize};

/// Messaging provider capability record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingProviderCapabilityRecord {
    /// Capability schema field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capability_schema: Option<std::collections::HashMap<String, String>>,

    /// Channel field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel: Option<String>,

    /// Country code field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub country_code: Option<String>,

    /// Created at field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Delivery purpose field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_purpose: Option<String>,

    /// Health status field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last verified at field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_verified_at: Option<String>,

    /// Locale field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub locale: Option<String>,

    /// Metadata field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider account id field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Rate limit policy field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_limit_policy: Option<std::collections::HashMap<String, String>>,

    /// Sandbox supported field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sandbox_supported: Option<bool>,

    /// Status field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Supports batch send field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_batch_send: Option<bool>,

    /// Supports delivery receipt field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_delivery_receipt: Option<bool>,

    /// Supports template sync field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_template_sync: Option<bool>,

    /// Supports test send field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_test_send: Option<bool>,

    /// Supports webhook field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supports_webhook: Option<bool>,

    /// Tenant id field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on messaging provider capability record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
