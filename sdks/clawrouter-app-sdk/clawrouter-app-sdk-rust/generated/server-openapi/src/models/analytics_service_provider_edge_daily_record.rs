use serde::{Deserialize, Serialize};

/// Analytics service provider edge daily record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AnalyticsServiceProviderEdgeDailyRecord {
    /// Billing meter code field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_code: Option<String>,

    /// Buyer provider id field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Catalog key field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_key: Option<String>,

    /// Created at field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Edge id field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub edge_id: Option<String>,

    /// Expense amount field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expense_amount: Option<String>,

    /// Id field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Income amount field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub income_amount: Option<String>,

    /// Margin amount field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub margin_amount: Option<String>,

    /// Metadata field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Model field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Rebuild version field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Report date field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub report_date: Option<String>,

    /// Request count field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_count: Option<String>,

    /// Seller provider id field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Source id field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Token count field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_count: Option<String>,

    /// Token kind field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_kind: Option<String>,

    /// Updated at field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on analytics service provider edge daily record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
