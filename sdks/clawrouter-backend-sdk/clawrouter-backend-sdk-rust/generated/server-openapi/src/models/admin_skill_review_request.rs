use serde::{Deserialize, Serialize};

/// Admin skill review request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminSkillReviewRequest {
    /// Comment field on admin skill review request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub comment: Option<String>,

    /// Review comment field on admin skill review request.
    #[serde(rename = "reviewComment")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub review_comment: Option<String>,
}
