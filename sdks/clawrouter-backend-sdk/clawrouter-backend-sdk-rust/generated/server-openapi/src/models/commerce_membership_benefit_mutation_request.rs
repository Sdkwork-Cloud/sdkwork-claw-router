use serde::{Deserialize, Serialize};

use crate::models::{MediaResource};

/// Commerce membership benefit mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceMembershipBenefitMutationRequest {
    /// Benefit key field on commerce membership benefit mutation request.
    #[serde(rename = "benefitKey")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub benefit_key: Option<String>,

    /// Claimed field on commerce membership benefit mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claimed: Option<bool>,

    /// Description field on commerce membership benefit mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Icon field on commerce membership benefit mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon: Option<MediaResource>,

    /// Id field on commerce membership benefit mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Name field on commerce membership benefit mutation request.
    pub name: String,

    /// Type field on commerce membership benefit mutation request.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub r#type: Option<String>,

    /// Usage limit field on commerce membership benefit mutation request.
    #[serde(rename = "usageLimit")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub usage_limit: Option<String>,

    /// Used count field on commerce membership benefit mutation request.
    #[serde(rename = "usedCount")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub used_count: Option<String>,
}
