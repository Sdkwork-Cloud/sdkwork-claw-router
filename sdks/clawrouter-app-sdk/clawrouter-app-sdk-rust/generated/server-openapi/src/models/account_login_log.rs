use serde::{Deserialize, Serialize};

/// Account login log schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AccountLoginLog {
    /// Device field on account login log.
    pub device: String,

    /// Masked client IP address.
    pub ip: String,

    /// Location field on account login log.
    pub location: String,

    /// Status field on account login log.
    pub status: String,

    /// Time field on account login log.
    pub time: String,
}
