use serde::{Deserialize, Serialize};

/// Admin course section mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseSectionMutationRequest {
    /// Description field on admin course section mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Metadata field on admin course section mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Section no field on admin course section mutation request.
    #[serde(rename = "sectionNo")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub section_no: Option<String>,

    /// Sort order field on admin course section mutation request.
    #[serde(rename = "sortOrder")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on admin course section mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Title field on admin course section mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
}
