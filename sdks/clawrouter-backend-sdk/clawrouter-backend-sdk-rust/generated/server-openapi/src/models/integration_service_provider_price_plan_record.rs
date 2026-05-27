use serde::{Deserialize, Serialize};

/// Integration service provider price plan record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderPricePlanRecord {
    /// Base amount source field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub base_amount_source: Option<String>,

    /// Buyer provider id field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Created at field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Data scope field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Default markup amount field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_markup_amount: Option<String>,

    /// Default multiplier field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub default_multiplier: Option<String>,

    /// Deleted at field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Edge id field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub edge_id: Option<String>,

    /// Effective from field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Fallback mode field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub fallback_mode: Option<String>,

    /// Id field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Plan code field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan_code: Option<String>,

    /// Plan name field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan_name: Option<String>,

    /// Pricing mode field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pricing_mode: Option<String>,

    /// Seller provider id field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Status field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider price plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
