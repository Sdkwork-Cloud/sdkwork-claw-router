use serde::{Deserialize, Serialize};

/// App api key group schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppApiKeyGroup {
    /// Code field on app api key group.
    pub code: String,

    /// Id field on app api key group.
    pub id: String,

    /// Name field on app api key group.
    pub name: String,

    /// Rate field on app api key group.
    pub rate: String,
}
