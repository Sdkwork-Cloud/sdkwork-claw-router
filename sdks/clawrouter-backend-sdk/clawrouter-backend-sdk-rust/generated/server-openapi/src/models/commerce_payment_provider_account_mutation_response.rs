use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentProviderAccountItem};

/// Commerce payment provider account mutation response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderAccountMutationResponse {
    /// Item field on commerce payment provider account mutation response.
    pub item: CommercePaymentProviderAccountItem,
}
