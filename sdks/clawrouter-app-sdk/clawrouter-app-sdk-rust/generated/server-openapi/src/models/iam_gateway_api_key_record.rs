use serde::{Deserialize, Serialize};

/// Iam gateway api key record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamGatewayApiKeyRecord {
    /// Channel group id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_group_id: Option<String>,

    /// Created at field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Environment field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub environment: Option<String>,

    /// Expire at field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expire_at: Option<String>,

    /// Hash alg field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub hash_alg: Option<String>,

    /// Id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency_key: Option<String>,

    /// Key display masked field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub key_display_masked: Option<String>,

    /// Key hash field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub key_hash: Option<String>,

    /// Key prefix field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub key_prefix: Option<String>,

    /// Last revealed at field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_revealed_at: Option<String>,

    /// Last used at field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,

    /// Last used ip hash field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_ip_hash: Option<String>,

    /// Last used ip masked field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_ip_masked: Option<String>,

    /// Last used ip region field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_ip_region: Option<String>,

    /// Legacy api key id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legacy_api_key_id: Option<String>,

    /// Metadata field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Name field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,

    /// Organization id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Policy id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub policy_id: Option<String>,

    /// Quota policy id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_policy_id: Option<String>,

    /// Rate limit policy id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_limit_policy_id: Option<String>,

    /// Revoked at field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub revoked_at: Option<String>,

    /// Revoked by field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub revoked_by: Option<String>,

    /// Rotated from key id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rotated_from_key_id: Option<String>,

    /// Secret version field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_version: Option<String>,

    /// Status field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on iam gateway api key record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
