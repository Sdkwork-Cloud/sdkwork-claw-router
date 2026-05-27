use serde::{Deserialize, Serialize};

/// Open platform qr auth session create request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformQrAuthSessionCreateRequest {
    /// Purpose field on open platform qr auth session create request.
    pub purpose: String,
}
