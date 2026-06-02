use serde::{Deserialize, Serialize};

/// Commerce payment provider account delete response schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentProviderAccountDeleteResponse {
    /// Deleted field on commerce payment provider account delete response.
    pub deleted: bool,
}
