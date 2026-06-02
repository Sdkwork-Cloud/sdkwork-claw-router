use serde::{Deserialize, Serialize};

/// Commerce membership plan record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipPlanRecord {
    /// Benefits json field on commerce membership plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub benefits_json: Option<std::collections::HashMap<String, String>>,

    /// Created at field on commerce membership plan record.
    pub created_at: String,

    /// Id field on commerce membership plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Level code field on commerce membership plan record.
    pub level_code: String,

    /// Name field on commerce membership plan record.
    pub name: String,

    /// Organization id field on commerce membership plan record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Plan no field on commerce membership plan record.
    pub plan_no: String,

    /// Sort order field on commerce membership plan record.
    pub sort_order: String,

    /// Status field on commerce membership plan record.
    pub status: String,

    /// Tenant id field on commerce membership plan record.
    pub tenant_id: String,

    /// Updated at field on commerce membership plan record.
    pub updated_at: String,
}
