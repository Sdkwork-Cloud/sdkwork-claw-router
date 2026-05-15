use serde::{Deserialize, Serialize};

/// Iam gateway risk rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamGatewayRiskRuleRecord {
    /// Action field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub action: Option<String>,

    /// Block duration seconds field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub block_duration_seconds: Option<String>,

    /// Burst limit field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub burst_limit: Option<String>,

    /// Created at field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Hit count field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub hit_count: Option<String>,

    /// Id field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Last hit at field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_hit_at: Option<String>,

    /// Match mode field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub match_mode: Option<String>,

    /// Metadata field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Priority field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Reason field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason: Option<String>,

    /// Requests per day field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requests_per_day: Option<String>,

    /// Requests per minute field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requests_per_minute: Option<String>,

    /// Requests per second field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requests_per_second: Option<String>,

    /// Rule category field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_category: Option<String>,

    /// Rule name field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_name: Option<String>,

    /// Rule type field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_type: Option<String>,

    /// Scope id field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_id: Option<String>,

    /// Scope type field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scope_type: Option<String>,

    /// Status field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target type field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_type: Option<String>,

    /// Target value field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_value: Option<String>,

    /// Target value cipher ref field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_value_cipher_ref: Option<String>,

    /// Target value hash field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_value_hash: Option<String>,

    /// Target value masked field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_value_masked: Option<String>,

    /// Tenant id field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Tokens per minute field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tokens_per_minute: Option<String>,

    /// Updated at field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on iam gateway risk rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
