use serde::{Deserialize, Serialize};

use crate::models::{AdminPaymentAttemptItem};

/// Admin payment attempts response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminPaymentAttemptsResponse {
    /// Items field on admin payment attempts response.
    pub items: Vec<AdminPaymentAttemptItem>,
}
