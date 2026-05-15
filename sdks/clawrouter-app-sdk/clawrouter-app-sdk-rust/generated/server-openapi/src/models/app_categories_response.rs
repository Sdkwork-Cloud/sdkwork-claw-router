use serde::{Deserialize, Serialize};

/// App categories response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppCategoriesResponse {
    /// Items field on app categories response.
    pub items: Vec<String>,
}
