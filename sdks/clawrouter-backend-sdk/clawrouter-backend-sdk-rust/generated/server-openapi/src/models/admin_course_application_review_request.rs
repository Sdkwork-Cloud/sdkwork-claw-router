use serde::{Deserialize, Serialize};

/// Admin course application review request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseApplicationReviewRequest {
    /// Review note field on admin course application review request.
    #[serde(rename = "reviewNote")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_note: Option<String>,

    /// Status field on admin course application review request.
    pub status: String,
}
