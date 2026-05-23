use serde::{Deserialize, Serialize};

/// Open platform pay binding item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpenPlatformPayBindingItem {
    /// Account id field on open platform pay binding item.
    #[serde(rename = "accountId")]
    pub account_id: String,

    /// Created at field on open platform pay binding item.
    #[serde(rename = "createdAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Id field on open platform pay binding item.
    pub id: String,

    /// Mode field on open platform pay binding item.
    pub mode: String,

    /// Payment account id field on open platform pay binding item.
    #[serde(rename = "paymentAccountId")]
    pub payment_account_id: String,

    /// Payment channel id field on open platform pay binding item.
    #[serde(rename = "paymentChannelId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub payment_channel_id: Option<String>,

    /// Scene field on open platform pay binding item.
    pub scene: String,

    /// Status field on open platform pay binding item.
    pub status: String,

    /// Updated at field on open platform pay binding item.
    #[serde(rename = "updatedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}
