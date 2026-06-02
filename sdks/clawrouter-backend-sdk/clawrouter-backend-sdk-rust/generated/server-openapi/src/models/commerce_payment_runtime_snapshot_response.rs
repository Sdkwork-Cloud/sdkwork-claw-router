use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentRuntimeAssemblyEvent, CommercePaymentRuntimeAssemblySummary};

/// Commerce payment runtime snapshot response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentRuntimeSnapshotResponse {
    /// Environment field on commerce payment runtime snapshot response.
    pub environment: String,

    /// Events field on commerce payment runtime snapshot response.
    pub events: Vec<CommercePaymentRuntimeAssemblyEvent>,

    /// Recorded at field on commerce payment runtime snapshot response.
    #[serde(rename = "recordedAt")]
    pub recorded_at: String,

    /// Summary field on commerce payment runtime snapshot response.
    pub summary: CommercePaymentRuntimeAssemblySummary,
}
