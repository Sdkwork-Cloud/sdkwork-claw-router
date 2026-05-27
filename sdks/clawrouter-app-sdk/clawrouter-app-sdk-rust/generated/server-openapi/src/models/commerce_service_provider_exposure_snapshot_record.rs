use serde::{Deserialize, Serialize};

/// Commerce service provider exposure snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceServiceProviderExposureSnapshotRecord {
    /// Balance amount field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub balance_amount: Option<String>,

    /// Calculated at field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub calculated_at: Option<String>,

    /// Created at field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credit limit amount field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credit_limit_amount: Option<String>,

    /// Currency field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Exposure amount field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub exposure_amount: Option<String>,

    /// Frozen amount field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub frozen_amount: Option<String>,

    /// Id field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Overdue amount field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub overdue_amount: Option<String>,

    /// Pending settlement amount field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pending_settlement_amount: Option<String>,

    /// Rebuild version field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Risk status field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk_status: Option<String>,

    /// Service provider id field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub service_provider_id: Option<String>,

    /// Source id field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Used credit amount field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub used_credit_amount: Option<String>,

    /// Uuid field on commerce service provider exposure snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
