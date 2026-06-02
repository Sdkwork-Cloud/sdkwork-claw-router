use serde::{Deserialize, Serialize};

/// Commerce membership record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipRecord {
    /// Auto renew field on commerce membership record.
    pub auto_renew: bool,

    /// Created at field on commerce membership record.
    pub created_at: String,

    /// Expires at field on commerce membership record.
    pub expires_at: String,

    /// Grace until field on commerce membership record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub grace_until: Option<String>,

    /// Id field on commerce membership record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Membership no field on commerce membership record.
    pub membership_no: String,

    /// Organization id field on commerce membership record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce membership record.
    pub owner_user_id: String,

    /// Plan id field on commerce membership record.
    pub plan_id: String,

    /// Source order id field on commerce membership record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_order_id: Option<String>,

    /// Source payment intent id field on commerce membership record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_payment_intent_id: Option<String>,

    /// Starts at field on commerce membership record.
    pub starts_at: String,

    /// Status field on commerce membership record.
    pub status: String,

    /// Tenant id field on commerce membership record.
    pub tenant_id: String,

    /// Updated at field on commerce membership record.
    pub updated_at: String,
}
