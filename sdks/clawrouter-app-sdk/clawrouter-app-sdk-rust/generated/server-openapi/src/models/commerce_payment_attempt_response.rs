use serde::{Deserialize, Serialize};

use crate::models::{CommercePaymentAttemptItem};

/// Commerce payment attempt response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentAttemptResponse {
    /// Item field on commerce payment attempt response.
    pub item: CommercePaymentAttemptItem,
}
