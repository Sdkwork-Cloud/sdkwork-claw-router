use serde::{Deserialize, Serialize};

/// Ops notification delivery record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsNotificationDeliveryRecord {
    /// Created at field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Data scope field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub data_scope: Option<String>,

    /// Deleted at field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<String>,

    /// Deleted by field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,

    /// Delivered at field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivered_at: Option<String>,

    /// Delivery channel field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_channel: Option<String>,

    /// Delivery status field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub delivery_status: Option<String>,

    /// Failure code field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure_code: Option<String>,

    /// Id field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Message id field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub message_id: Option<String>,

    /// Metadata field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner id field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_id: Option<String>,

    /// Owner type field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub owner_type: Option<String>,

    /// Read at field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub read_at: Option<String>,

    /// Retry count field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retry_count: Option<i64>,

    /// Status field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Updated at field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// User id field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,

    /// Uuid field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,

    /// Version field on ops notification delivery record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}
