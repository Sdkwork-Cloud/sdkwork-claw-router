use serde::{Deserialize, Serialize};

/// Ai routing rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiRoutingRuleRecord {
    /// Candidate channels field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub candidate_channels: Option<std::collections::HashMap<String, String>>,

    /// Constraints field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub constraints: Option<std::collections::HashMap<String, String>>,

    /// Created at field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Effective from field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Fallback chain field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fallback_chain: Option<std::collections::HashMap<String, String>>,

    /// Id field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Match expression field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub match_expression: Option<std::collections::HashMap<String, String>>,

    /// Metadata field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Priority field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Profile id field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub profile_id: Option<String>,

    /// Rate limit policy id field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rate_limit_policy_id: Option<String>,

    /// Rule code field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_code: Option<String>,

    /// Status field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Target model field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_model: Option<String>,

    /// Tenant id field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ai routing rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
