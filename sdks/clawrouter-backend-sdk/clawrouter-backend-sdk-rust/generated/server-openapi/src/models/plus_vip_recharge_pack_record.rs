use serde::{Deserialize, Serialize};

/// Plus vip recharge pack record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PlusVipRechargePackRecord {
    #[serde(flatten)]
    pub additional_properties: std::collections::HashMap<String, serde_json::Value>,
}
