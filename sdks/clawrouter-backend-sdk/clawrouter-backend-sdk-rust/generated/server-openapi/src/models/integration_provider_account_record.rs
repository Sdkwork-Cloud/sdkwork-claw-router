use serde::{Deserialize, Serialize};

/// Integration provider account record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationProviderAccountRecord {
    /// Account code field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_code: Option<String>,

    /// Account name field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_name: Option<String>,

    /// Auth config field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_config: Option<std::collections::HashMap<String, String>>,

    /// Auth type field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_type: Option<String>,

    /// Consecutive error count field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub consecutive_error_count: Option<String>,

    /// Created at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credential profile field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credential_profile: Option<String>,

    /// Data scope field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// External account id field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_account_id: Option<String>,

    /// Id field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last balance checked at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_balance_checked_at: Option<String>,

    /// Last rotated at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_rotated_at: Option<String>,

    /// Last used at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_used_at: Option<String>,

    /// Last verified at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_verified_at: Option<String>,

    /// Masked label field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub masked_label: Option<String>,

    /// Metadata field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Next rotate at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub next_rotate_at: Option<String>,

    /// Organization id field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider code field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Provider id field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_id: Option<String>,

    /// Quota limit field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_limit: Option<String>,

    /// Quota unit field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_unit: Option<String>,

    /// Quota used field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_used: Option<String>,

    /// Risk level field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_level: Option<String>,

    /// Secret hash field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_hash: Option<String>,

    /// Secret ref field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_ref: Option<String>,

    /// Secret rotation policy field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_rotation_policy: Option<std::collections::HashMap<String, String>>,

    /// Secret version field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secret_version: Option<String>,

    /// Status field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Upstream balance amount field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upstream_balance_amount: Option<String>,

    /// Upstream balance currency field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub upstream_balance_currency: Option<String>,

    /// Uuid field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration provider account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
