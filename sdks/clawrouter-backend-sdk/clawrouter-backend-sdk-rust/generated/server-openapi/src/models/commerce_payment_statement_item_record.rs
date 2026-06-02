use serde::{Deserialize, Serialize};

/// Commerce payment statement item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentStatementItemRecord {
    /// Created at field on commerce payment statement item record.
    pub created_at: String,

    /// Currency code field on commerce payment statement item record.
    pub currency_code: String,

    /// Fee amount field on commerce payment statement item record.
    pub fee_amount: String,

    /// Gross amount field on commerce payment statement item record.
    pub gross_amount: String,

    /// Id field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata json field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_json: Option<std::collections::HashMap<String, String>>,

    /// Native order no field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub native_order_no: Option<String>,

    /// Native refund id field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub native_refund_id: Option<String>,

    /// Native trade id field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub native_trade_id: Option<String>,

    /// Net amount field on commerce payment statement item record.
    pub net_amount: String,

    /// Occurred at field on commerce payment statement item record.
    pub occurred_at: String,

    /// Organization id field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider account id field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_account_id: Option<String>,

    /// Provider code field on commerce payment statement item record.
    pub provider_code: String,

    /// Provider status field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_status: Option<String>,

    /// Raw row digest field on commerce payment statement item record.
    pub raw_row_digest: String,

    /// Row no field on commerce payment statement item record.
    pub row_no: String,

    /// Sdkwork out refund no field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sdkwork_out_refund_no: Option<String>,

    /// Sdkwork out trade no field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sdkwork_out_trade_no: Option<String>,

    /// Settled at field on commerce payment statement item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub settled_at: Option<String>,

    /// Statement id field on commerce payment statement item record.
    pub statement_id: String,

    /// Tenant id field on commerce payment statement item record.
    pub tenant_id: String,

    /// Transaction type field on commerce payment statement item record.
    pub transaction_type: String,
}
