use serde::{Deserialize, Serialize};

/// Commerce membership entitlement record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipEntitlementRecord {
    /// Created at field on commerce membership entitlement record.
    pub created_at: String,

    /// Entitlement code field on commerce membership entitlement record.
    pub entitlement_code: String,

    /// Id field on commerce membership entitlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Name field on commerce membership entitlement record.
    pub name: String,

    /// Organization id field on commerce membership entitlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Plan id field on commerce membership entitlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan_id: Option<String>,

    /// Quota amount field on commerce membership entitlement record.
    pub quota_amount: String,

    /// Quota period field on commerce membership entitlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub quota_period: Option<String>,

    /// Reset policy field on commerce membership entitlement record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reset_policy: Option<String>,

    /// Status field on commerce membership entitlement record.
    pub status: String,

    /// Tenant id field on commerce membership entitlement record.
    pub tenant_id: String,

    /// Updated at field on commerce membership entitlement record.
    pub updated_at: String,
}
