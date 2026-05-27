use serde::{Deserialize, Serialize};

/// Admin course relations replace request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminCourseRelationsReplaceRequest {
    /// Items field on admin course relations replace request.
    pub items: Vec<serde_json::Value>,
}
