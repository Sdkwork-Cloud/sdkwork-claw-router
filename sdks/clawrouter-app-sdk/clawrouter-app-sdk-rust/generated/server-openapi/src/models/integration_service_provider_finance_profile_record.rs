use serde::{Deserialize, Serialize};

/// Integration service provider finance profile record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderFinanceProfileRecord {
    /// Billing cycle field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_cycle: Option<String>,

    /// Created at field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Credit limit amount field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub credit_limit_amount: Option<String>,

    /// Currency field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Data scope field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Id field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Invoice title id field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invoice_title_id: Option<String>,

    /// Metadata field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payment terms days field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_terms_days: Option<i64>,

    /// Service provider id field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub service_provider_id: Option<String>,

    /// Settlement day field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_day: Option<i64>,

    /// Settlement mode field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settlement_mode: Option<String>,

    /// Status field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Suspend threshold amount field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub suspend_threshold_amount: Option<String>,

    /// Tax profile ref field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tax_profile_ref: Option<String>,

    /// Tenant id field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,

    /// Warning threshold amount field on integration service provider finance profile record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub warning_threshold_amount: Option<String>,
}
