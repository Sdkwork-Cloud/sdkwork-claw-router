use serde::{Deserialize, Serialize};

use crate::models::{ProviderConfig};

/// Providers response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct ProvidersResponse {
    /// Items field on providers response.
    pub items: Vec<ProviderConfig>,
}
