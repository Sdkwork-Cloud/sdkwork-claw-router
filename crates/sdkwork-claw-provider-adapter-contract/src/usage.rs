use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AdapterUsage {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub billing_units: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub input_tokens: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output_tokens: Option<i64>,
}

impl AdapterUsage {
    pub fn is_empty(&self) -> bool {
        self.billing_units.is_none() && self.input_tokens.is_none() && self.output_tokens.is_none()
    }
}
