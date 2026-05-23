use serde::{Deserialize, Serialize};

/// Commerce membership entitlement usage record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipEntitlementUsageRecord {
    /// Balance after field on commerce membership entitlement usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub balance_after: Option<String>,

    /// Created at field on commerce membership entitlement usage record.
    pub created_at: String,

    /// Entitlement id field on commerce membership entitlement usage record.
    pub entitlement_id: String,

    /// Idempotency key field on commerce membership entitlement usage record.
    pub idempotency_key: String,

    /// Membership id field on commerce membership entitlement usage record.
    pub membership_id: String,

    /// Occurred at field on commerce membership entitlement usage record.
    pub occurred_at: String,

    /// Organization id field on commerce membership entitlement usage record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce membership entitlement usage record.
    pub owner_user_id: String,

    /// Source id field on commerce membership entitlement usage record.
    pub source_id: String,

    /// Source type field on commerce membership entitlement usage record.
    pub source_type: String,

    /// Tenant id field on commerce membership entitlement usage record.
    pub tenant_id: String,

    /// Usage no field on commerce membership entitlement usage record.
    pub usage_no: String,

    /// Used amount field on commerce membership entitlement usage record.
    pub used_amount: String,
}
