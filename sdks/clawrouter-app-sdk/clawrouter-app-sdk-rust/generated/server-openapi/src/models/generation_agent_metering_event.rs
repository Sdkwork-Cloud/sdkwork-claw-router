use serde::{Deserialize, Serialize};

use crate::models::{GenerationAgentUsageFactMetadata};

/// Generation agent metering event schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GenerationAgentMeteringEvent {
    /// Quantity field on generation agent metering event.
    pub quantity: String,

    /// Type field on generation agent metering event.
    pub r#type: String,

    /// Usage fact metadata field on generation agent metering event.
    #[serde(rename = "usageFactMetadata")]
    pub usage_fact_metadata: GenerationAgentUsageFactMetadata,
}
