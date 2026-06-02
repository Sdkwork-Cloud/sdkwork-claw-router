use serde::{Deserialize, Serialize};

/// Commerce payment statement record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentStatementRecord {
    /// Created at field on commerce payment statement record.
    pub created_at: String,

    /// Download status field on commerce payment statement record.
    pub download_status: String,

    /// Downloaded at field on commerce payment statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub downloaded_at: Option<String>,

    /// Fee amount field on commerce payment statement record.
    pub fee_amount: String,

    /// File digest field on commerce payment statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_digest: Option<String>,

    /// File ref field on commerce payment statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_ref: Option<String>,

    /// Id field on commerce payment statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce payment statement record.
    pub idempotency_key: String,

    /// Net amount field on commerce payment statement record.
    pub net_amount: String,

    /// Organization id field on commerce payment statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Parse status field on commerce payment statement record.
    pub parse_status: String,

    /// Parsed at field on commerce payment statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parsed_at: Option<String>,

    /// Period end field on commerce payment statement record.
    pub period_end: String,

    /// Period start field on commerce payment statement record.
    pub period_start: String,

    /// Provider account id field on commerce payment statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment statement record.
    pub provider_code: String,

    /// Provider statement id field on commerce payment statement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_statement_id: Option<String>,

    /// Request no field on commerce payment statement record.
    pub request_no: String,

    /// Row count field on commerce payment statement record.
    pub row_count: String,

    /// Settlement currency field on commerce payment statement record.
    pub settlement_currency: String,

    /// Statement no field on commerce payment statement record.
    pub statement_no: String,

    /// Statement type field on commerce payment statement record.
    pub statement_type: String,

    /// Tenant id field on commerce payment statement record.
    pub tenant_id: String,

    /// Total amount field on commerce payment statement record.
    pub total_amount: String,

    /// Updated at field on commerce payment statement record.
    pub updated_at: String,
}
