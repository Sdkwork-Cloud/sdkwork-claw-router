use serde::{Deserialize, Serialize};

/// Messaging sender identity record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingSenderIdentityRecord {
    /// Country code field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub country_code: Option<String>,

    /// Created at field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Display name field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,

    /// Domain name field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub domain_name: Option<String>,

    /// From email field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub from_email: Option<String>,

    /// From name field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub from_name: Option<String>,

    /// Id field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Rejection reason field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rejection_reason: Option<String>,

    /// Reply to field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reply_to: Option<String>,

    /// Sender id field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sender_id: Option<String>,

    /// Sign name field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sign_name: Option<String>,

    /// Status field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Verified at field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub verified_at: Option<String>,

    /// Version field on messaging sender identity record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
