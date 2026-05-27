use serde::{Deserialize, Serialize};

/// Commerce usage service provider statement record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUsageServiceProviderStatementRecord {
    /// Buyer provider id field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub buyer_provider_id: Option<String>,

    /// Created at field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Due at field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub due_at: Option<String>,

    /// Generated at field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub generated_at: Option<String>,

    /// Id field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Invoice id field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invoice_id: Option<String>,

    /// Metadata field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Paid at field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub paid_at: Option<String>,

    /// Payable amount field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payable_amount: Option<String>,

    /// Payment status field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_status: Option<String>,

    /// Period field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period: Option<String>,

    /// Period end field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_end: Option<String>,

    /// Period start field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_start: Option<String>,

    /// Rebuild version field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Receivable amount field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub receivable_amount: Option<String>,

    /// Seller provider id field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub seller_provider_id: Option<String>,

    /// Source id field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Statement no field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_no: Option<String>,

    /// Statement status field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_status: Option<String>,

    /// Status field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Total requests field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_requests: Option<String>,

    /// Total tokens field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_tokens: Option<String>,

    /// Updated at field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on commerce usage service provider statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
