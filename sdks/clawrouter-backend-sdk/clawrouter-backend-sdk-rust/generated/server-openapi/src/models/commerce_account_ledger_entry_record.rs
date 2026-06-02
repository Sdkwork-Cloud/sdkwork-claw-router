use serde::{Deserialize, Serialize};

/// Commerce account ledger entry record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceAccountLedgerEntryRecord {
    /// Account id field on commerce account ledger entry record.
    pub account_id: String,

    /// Amount field on commerce account ledger entry record.
    pub amount: String,

    /// Asset type field on commerce account ledger entry record.
    pub asset_type: String,

    /// Balance after field on commerce account ledger entry record.
    pub balance_after: String,

    /// Business type field on commerce account ledger entry record.
    pub business_type: String,

    /// Created at field on commerce account ledger entry record.
    pub created_at: String,

    /// Direction field on commerce account ledger entry record.
    pub direction: String,

    /// Id field on commerce account ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Idempotency key field on commerce account ledger entry record.
    pub idempotency_key: String,

    /// Organization id field on commerce account ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce account ledger entry record.
    pub owner_user_id: String,

    /// Remark field on commerce account ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub remark: Option<String>,

    /// Request no field on commerce account ledger entry record.
    pub request_no: String,

    /// Source id field on commerce account ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on commerce account ledger entry record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Tenant id field on commerce account ledger entry record.
    pub tenant_id: String,

    /// Transaction no field on commerce account ledger entry record.
    pub transaction_no: String,
}
