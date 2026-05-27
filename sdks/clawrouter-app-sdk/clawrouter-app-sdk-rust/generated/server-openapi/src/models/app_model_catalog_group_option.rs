use serde::{Deserialize, Serialize};

/// App model catalog group option schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AppModelCatalogGroupOption {
    /// Key field on app model catalog group option.
    pub key: String,

    /// Label field on app model catalog group option.
    pub label: String,

    /// Model count field on app model catalog group option.
    #[serde(rename = "modelCount")]
    pub model_count: i64,
}
