use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentIntentItem};

/// Commerce payment intent response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentIntentResponse {
    /// Item field on commerce payment intent response.
    pub item: CommercePaymentIntentItem,
}
