use serde::{Deserialize, Serialize};

/// Settlement chart point schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SettlementChartPoint {
    /// Audio field on settlement chart point.
    pub audio: String,

    /// Day field on settlement chart point.
    pub day: String,

    /// Image field on settlement chart point.
    pub image: String,

    /// Music field on settlement chart point.
    pub music: String,

    /// Text field on settlement chart point.
    pub text: String,

    /// Video field on settlement chart point.
    pub video: String,
}
