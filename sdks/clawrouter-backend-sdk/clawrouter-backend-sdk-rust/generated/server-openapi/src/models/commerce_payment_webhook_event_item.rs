use serde::{Deserialize, Serialize};

/// Commerce payment webhook event item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentWebhookEventItem {
    /// Event no field on commerce payment webhook event item.
    #[serde(rename = "eventNo")]
    pub event_no: String,

    /// Event type field on commerce payment webhook event item.
    #[serde(rename = "eventType")]
    pub event_type: String,

    /// External event id field on commerce payment webhook event item.
    #[serde(rename = "externalEventId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub external_event_id: Option<String>,

    /// Id field on commerce payment webhook event item.
    pub id: String,

    /// Process status field on commerce payment webhook event item.
    #[serde(rename = "processStatus")]
    pub process_status: String,

    /// Processed at field on commerce payment webhook event item.
    #[serde(rename = "processedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub processed_at: Option<String>,

    /// Provider code field on commerce payment webhook event item.
    #[serde(rename = "providerCode")]
    pub provider_code: String,

    /// Received at field on commerce payment webhook event item.
    #[serde(rename = "receivedAt")]
    pub received_at: String,
}
