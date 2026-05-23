use serde::{Deserialize, Serialize};

/// Ai chat message part record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct AiChatMessagePartRecord {
    /// Asset id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub asset_id: Option<String>,

    /// Created at field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// File name field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_name: Option<String>,

    /// File size field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub file_size: Option<String>,

    /// Id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Item id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub item_id: Option<String>,

    /// Json content field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub json_content: Option<std::collections::HashMap<String, String>>,

    /// Legal hold field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub legal_hold: Option<bool>,

    /// Message id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_id: Option<String>,

    /// Metadata field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Mime type field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub mime_type: Option<String>,

    /// Organization id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Part no field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub part_no: Option<i64>,

    /// Part type field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub part_type: Option<String>,

    /// Payload hash field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payload_hash: Option<String>,

    /// Provider part id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider_part_id: Option<String>,

    /// Request id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub request_id: Option<String>,

    /// Retention until field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retention_until: Option<String>,

    /// Sha 256 field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sha256: Option<String>,

    /// Status field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Storage url field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub storage_url: Option<String>,

    /// Tenant id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Text content field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub text_content: Option<String>,

    /// Trace id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trace_id: Option<String>,

    /// User id field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ai chat message part record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
