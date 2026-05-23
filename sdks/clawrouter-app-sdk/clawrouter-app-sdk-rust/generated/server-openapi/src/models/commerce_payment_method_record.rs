use serde::{Deserialize, Serialize};

/// Commerce payment method record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentMethodRecord {
    /// Created at field on commerce payment method record.
    pub created_at: String,

    /// Display name field on commerce payment method record.
    pub display_name: String,

    /// Idempotency key field on commerce payment method record.
    pub idempotency_key: String,

    /// Method key field on commerce payment method record.
    pub method_key: String,

    /// Organization id field on commerce payment method record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider field on commerce payment method record.
    pub provider: String,

    /// Request no field on commerce payment method record.
    pub request_no: String,

    /// Status field on commerce payment method record.
    pub status: String,

    /// Tenant id field on commerce payment method record.
    pub tenant_id: String,

    /// Updated at field on commerce payment method record.
    pub updated_at: String,
}
