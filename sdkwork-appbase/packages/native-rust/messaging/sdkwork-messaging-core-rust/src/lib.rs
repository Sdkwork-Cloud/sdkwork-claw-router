#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingChannel {
    Sms,
    Email,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingDeliveryPurpose {
    Verification,
    Transactional,
    Marketing,
    System,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MessagingDeliveryStatus {
    Accepted,
    Queued,
    Sent,
    Delivered,
    Failed,
    Suppressed,
    Expired,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingDeliveryRequest {
    pub channel: MessagingChannel,
    pub delivery_purpose: MessagingDeliveryPurpose,
    pub idempotency_key: String,
    pub scene_code: String,
    pub target_hash: String,
    pub target_masked: String,
    pub template_code: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MessagingDeliveryResult {
    pub delivery_status: MessagingDeliveryStatus,
    pub provider_code: Option<String>,
    pub provider_message_id: Option<String>,
    pub request_id: String,
}

pub const SDKWORK_MESSAGING_DOMAIN: &str = "messaging";
