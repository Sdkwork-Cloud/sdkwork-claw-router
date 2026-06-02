use serde::{Deserialize, Serialize};

/// Commerce membership package group record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipPackageGroupRecord {
    /// Created at field on commerce membership package group record.
    pub created_at: String,

    /// Description field on commerce membership package group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Group no field on commerce membership package group record.
    pub group_no: String,

    /// Id field on commerce membership package group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Name field on commerce membership package group record.
    pub name: String,

    /// Organization id field on commerce membership package group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Plan id field on commerce membership package group record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan_id: Option<String>,

    /// Sort order field on commerce membership package group record.
    pub sort_order: String,

    /// Status field on commerce membership package group record.
    pub status: String,

    /// Tenant id field on commerce membership package group record.
    pub tenant_id: String,

    /// Updated at field on commerce membership package group record.
    pub updated_at: String,
}
