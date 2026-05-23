use serde::{Deserialize, Serialize};

use crate::models::{UsageSnapshot};

/// Agent run step complete request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AgentRunStepCompleteRequest {
    /// Error message masked field on agent run step complete request.
    #[serde(rename = "errorMessageMasked")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub error_message_masked: Option<String>,

    /// Metadata field on agent run step complete request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Output json field on agent run step complete request.
    #[serde(rename = "outputJson")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output_json: Option<std::collections::HashMap<String, String>>,

    /// Status field on agent run step complete request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Usage json field on agent run step complete request.
    #[serde(rename = "usageJson")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_json: Option<UsageSnapshot>,
}
