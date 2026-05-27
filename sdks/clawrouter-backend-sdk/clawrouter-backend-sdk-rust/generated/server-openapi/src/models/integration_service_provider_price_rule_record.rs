use serde::{Deserialize, Serialize};

/// Integration service provider price rule record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct IntegrationServiceProviderPriceRuleRecord {
    /// Billing meter code field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub billing_meter_code: Option<String>,

    /// Buyer provider id field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Catalog key field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub catalog_key: Option<String>,

    /// Channel id field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub channel_id: Option<String>,

    /// Created at field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Edge id field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub edge_id: Option<String>,

    /// Effective from field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_from: Option<String>,

    /// Effective to field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub effective_to: Option<String>,

    /// Id field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Minimum charge field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub minimum_charge: Option<String>,

    /// Model field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub model: Option<String>,

    /// Organization id field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Price plan id field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub price_plan_id: Option<String>,

    /// Priority field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub priority: Option<i64>,

    /// Provider code field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_code: Option<String>,

    /// Rounding mode field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rounding_mode: Option<String>,

    /// Seller provider id field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Status field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Token kind field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub token_kind: Option<String>,

    /// Unit price field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit_price: Option<String>,

    /// Unit size field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub unit_size: Option<String>,

    /// Updated at field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on integration service provider price rule record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
