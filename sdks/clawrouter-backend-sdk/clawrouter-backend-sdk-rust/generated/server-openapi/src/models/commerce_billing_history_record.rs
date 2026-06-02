use serde::{Deserialize, Serialize};

/// Commerce billing history record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceBillingHistoryRecord {
    /// Amount field on commerce billing history record.
    pub amount: String,

    /// Asset type field on commerce billing history record.
    pub asset_type: String,

    /// Created at field on commerce billing history record.
    pub created_at: String,

    /// Currency code field on commerce billing history record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency_code: Option<String>,

    /// Direction field on commerce billing history record.
    pub direction: String,

    /// History no field on commerce billing history record.
    pub history_no: String,

    /// History type field on commerce billing history record.
    pub history_type: String,

    /// Id field on commerce billing history record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Metadata json field on commerce billing history record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata_json: Option<std::collections::HashMap<String, String>>,

    /// Occurred at field on commerce billing history record.
    pub occurred_at: String,

    /// Organization id field on commerce billing history record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce billing history record.
    pub owner_user_id: String,

    /// Payment method field on commerce billing history record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_method: Option<String>,

    /// Points delta field on commerce billing history record.
    pub points_delta: String,

    /// Reference no field on commerce billing history record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reference_no: Option<String>,

    /// Related order id field on commerce billing history record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub related_order_id: Option<String>,

    /// Related order no field on commerce billing history record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub related_order_no: Option<String>,

    /// Source id field on commerce billing history record.
    pub source_id: String,

    /// Source type field on commerce billing history record.
    pub source_type: String,

    /// Status field on commerce billing history record.
    pub status: String,

    /// Tenant id field on commerce billing history record.
    pub tenant_id: String,

    /// Title field on commerce billing history record.
    pub title: String,

    /// Updated at field on commerce billing history record.
    pub updated_at: String,
}
