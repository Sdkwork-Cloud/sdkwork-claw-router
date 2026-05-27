use serde::{Deserialize, Serialize};

/// Promotion offer scope record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionOfferScopeRecord {
    /// Created at field on promotion offer scope record.
    pub created_at: String,

    /// Match mode field on promotion offer scope record.
    pub match_mode: String,

    /// Offer version id field on promotion offer scope record.
    pub offer_version_id: String,

    /// Organization id field on promotion offer scope record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Scope type field on promotion offer scope record.
    pub scope_type: String,

    /// Target code field on promotion offer scope record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_code: Option<String>,

    /// Target id field on promotion offer scope record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub target_id: Option<String>,

    /// Tenant id field on promotion offer scope record.
    pub tenant_id: String,

    /// Updated at field on promotion offer scope record.
    pub updated_at: String,
}
