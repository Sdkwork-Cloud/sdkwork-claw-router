use serde::{Deserialize, Serialize};

use crate::models::{CommercePriceListItem};

/// Commerce price list mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePriceListMutationResponse {
    /// Item field on commerce price list mutation response.
    pub item: CommercePriceListItem,
}
