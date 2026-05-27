use serde::{Deserialize, Serialize};

/// Admin course application item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseApplicationItem {
    /// Id field on admin course application item.
    pub id: String,

    /// Reviewed at field on admin course application item.
    #[serde(rename = "reviewedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reviewed_at: Option<String>,

    /// Status field on admin course application item.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}
