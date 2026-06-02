use serde::{Deserialize, Serialize};

/// Commerce payment fee record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentFeeRecord {
    /// Amount field on commerce payment fee record.
    pub amount: String,

    /// Created at field on commerce payment fee record.
    pub created_at: String,

    /// Currency code field on commerce payment fee record.
    pub currency_code: String,

    /// Fee type field on commerce payment fee record.
    pub fee_type: String,

    /// Id field on commerce payment fee record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Occurred at field on commerce payment fee record.
    pub occurred_at: String,

    /// Organization id field on commerce payment fee record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Payment attempt id field on commerce payment fee record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_attempt_id: Option<String>,

    /// Provider account id field on commerce payment fee record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment fee record.
    pub provider_code: String,

    /// Refund id field on commerce payment fee record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub refund_id: Option<String>,

    /// Statement item id field on commerce payment fee record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub statement_item_id: Option<String>,

    /// Tenant id field on commerce payment fee record.
    pub tenant_id: String,
}
