use serde::{Deserialize, Serialize};

/// Messaging route rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct MessagingRouteRuleRecord {
    /// App id field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub app_id: Option<String>,

    /// Channel field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel: Option<String>,

    /// Country code field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub country_code: Option<String>,

    /// Created at field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Delivery purpose field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_purpose: Option<String>,

    /// Effective from field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Failover policy field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failover_policy: Option<std::collections::HashMap<String, String>>,

    /// Id field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Locale field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub locale: Option<String>,

    /// Metadata field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Priority field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Rule code field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule_code: Option<String>,

    /// Scene code field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub scene_code: Option<String>,

    /// Selection policy field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub selection_policy: Option<std::collections::HashMap<String, String>>,

    /// Status field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User segment field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_segment: Option<String>,

    /// Uuid field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Weight field on messaging route rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub weight: Option<i64>,
}
