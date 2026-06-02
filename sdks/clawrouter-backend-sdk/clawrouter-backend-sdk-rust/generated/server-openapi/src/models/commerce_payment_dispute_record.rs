use serde::{Deserialize, Serialize};

/// Commerce payment dispute record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentDisputeRecord {
    /// Amount field on commerce payment dispute record.
    pub amount: String,

    /// Closed at field on commerce payment dispute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub closed_at: Option<String>,

    /// Created at field on commerce payment dispute record.
    pub created_at: String,

    /// Currency code field on commerce payment dispute record.
    pub currency_code: String,

    /// Dispute no field on commerce payment dispute record.
    pub dispute_no: String,

    /// Evidence due at field on commerce payment dispute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub evidence_due_at: Option<String>,

    /// Id field on commerce payment dispute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Native dispute id field on commerce payment dispute record.
    pub native_dispute_id: String,

    /// Opened at field on commerce payment dispute record.
    pub opened_at: String,

    /// Organization id field on commerce payment dispute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payment attempt id field on commerce payment dispute record.
    pub payment_attempt_id: String,

    /// Provider account id field on commerce payment dispute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment dispute record.
    pub provider_code: String,

    /// Reason code field on commerce payment dispute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reason_code: Option<String>,

    /// Status field on commerce payment dispute record.
    pub status: String,

    /// Tenant id field on commerce payment dispute record.
    pub tenant_id: String,

    /// Updated at field on commerce payment dispute record.
    pub updated_at: String,
}
