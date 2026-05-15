use serde::{Deserialize, Serialize};

/// Iam gateway api key group metric snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IamGatewayApiKeyGroupMetricSnapshotRecord {
    /// Account available count field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_available_count: Option<String>,

    /// Account total count field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub account_total_count: Option<String>,

    /// Capacity limit field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capacity_limit: Option<String>,

    /// Capacity used field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub capacity_used: Option<String>,

    /// Created at field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Group code field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_code: Option<String>,

    /// Group id field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub group_id: Option<String>,

    /// Health status field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub health_status: Option<String>,

    /// Id field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider code field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Rebuild version field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Request count today field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count_today: Option<String>,

    /// Request count total field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count_total: Option<String>,

    /// Snapshot at field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub snapshot_at: Option<String>,

    /// Source id field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Usage amount today field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_amount_today: Option<String>,

    /// Usage amount total field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_amount_total: Option<String>,

    /// Uuid field on iam gateway api key group metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
