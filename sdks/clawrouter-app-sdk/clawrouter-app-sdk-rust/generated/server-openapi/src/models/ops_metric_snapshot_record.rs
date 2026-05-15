use serde::{Deserialize, Serialize};

/// Ops metric snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsMetricSnapshotRecord {
    /// Created at field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Dimension key field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub dimension_key: Option<String>,

    /// Dimension value field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub dimension_value: Option<String>,

    /// Id field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Metric name field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metric_name: Option<String>,

    /// Metric period field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metric_period: Option<String>,

    /// Metric scope field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metric_scope: Option<String>,

    /// Metric unit field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metric_unit: Option<String>,

    /// Metric value field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metric_value: Option<String>,

    /// Organization id field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payload field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload: Option<std::collections::HashMap<String, String>>,

    /// Period end field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_end: Option<String>,

    /// Period start field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_start: Option<String>,

    /// Rebuild version field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Source id field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ops metric snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
