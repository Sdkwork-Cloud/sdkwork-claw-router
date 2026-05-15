use serde::{Deserialize, Serialize};

use crate::models::{SkillCatalogItem};

/// Skills catalog response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SkillsCatalogResponse {
    /// Items field on skills catalog response.
    pub items: Vec<SkillCatalogItem>,
}
