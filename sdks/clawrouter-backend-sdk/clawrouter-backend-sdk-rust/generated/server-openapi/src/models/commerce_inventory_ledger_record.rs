use serde::{Deserialize, Serialize};

/// Commerce inventory ledger record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInventoryLedgerRecord {
    /// Business type field on commerce inventory ledger record.
    pub business_type: String,

    /// Created at field on commerce inventory ledger record.
    pub created_at: String,

    /// Direction field on commerce inventory ledger record.
    pub direction: String,

    /// Idempotency key field on commerce inventory ledger record.
    pub idempotency_key: String,

    /// Movement no field on commerce inventory ledger record.
    pub movement_no: String,

    /// Organization id field on commerce inventory ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Sku id field on commerce inventory ledger record.
    pub sku_id: String,

    /// Source id field on commerce inventory ledger record.
    pub source_id: String,

    /// Source type field on commerce inventory ledger record.
    pub source_type: String,

    /// Tenant id field on commerce inventory ledger record.
    pub tenant_id: String,

    /// Warehouse id field on commerce inventory ledger record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub warehouse_id: Option<String>,
}
