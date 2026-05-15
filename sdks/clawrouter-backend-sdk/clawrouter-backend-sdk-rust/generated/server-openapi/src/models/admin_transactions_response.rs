use serde::{Deserialize, Serialize};

use crate::models::{AdminTransactionRecordItem};

/// Admin transactions response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AdminTransactionsResponse {
    /// Items field on admin transactions response.
    pub items: Vec<AdminTransactionRecordItem>,
}
