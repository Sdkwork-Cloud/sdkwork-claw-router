use serde::{Deserialize, Serialize};

use crate::models::{CommerceInventoryReservationListResponse};

/// Inventory reservations list result schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct InventoryReservationsListResult {
    /// Business response code.
    pub code: String,

    /// Data field on inventory reservations list result.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data: Option<CommerceInventoryReservationListResponse>,

    /// Human-readable response message.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub msg: Option<String>,
}
