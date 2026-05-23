use serde::{Deserialize, Serialize};

/// Commerce refund item record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceRefundItemRecord {
    /// Created at field on commerce refund item record.
    pub created_at: String,

    /// Order item id field on commerce refund item record.
    pub order_item_id: String,

    /// Organization id field on commerce refund item record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Refund amount field on commerce refund item record.
    pub refund_amount: String,

    /// Refund id field on commerce refund item record.
    pub refund_id: String,

    /// Tenant id field on commerce refund item record.
    pub tenant_id: String,
}
