use serde::{Deserialize, Serialize};

/// Promotion coupon wallet item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct PromotionCouponWalletItem {
    /// Claim source field on promotion coupon wallet item.
    #[serde(rename = "claimSource")]
    pub claim_source: String,

    /// Claimed at field on promotion coupon wallet item.
    #[serde(rename = "claimedAt")]
    pub claimed_at: String,

    /// Code id field on promotion coupon wallet item.
    #[serde(rename = "codeId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub code_id: Option<String>,

    /// Coupon no field on promotion coupon wallet item.
    #[serde(rename = "couponNo")]
    pub coupon_no: String,

    /// Currency code field on promotion coupon wallet item.
    #[serde(rename = "currencyCode")]
    pub currency_code: String,

    /// Discount type field on promotion coupon wallet item.
    #[serde(rename = "discountType")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub discount_type: Option<String>,

    /// Expires at field on promotion coupon wallet item.
    #[serde(rename = "expiresAt")]
    pub expires_at: String,

    /// Face value minor field on promotion coupon wallet item.
    #[serde(rename = "faceValueMinor")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub face_value_minor: Option<i64>,

    /// Stable promotion_user_coupon id.
    pub id: String,

    /// Lock expires at field on promotion coupon wallet item.
    #[serde(rename = "lockExpiresAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub lock_expires_at: Option<String>,

    /// Locked at field on promotion coupon wallet item.
    #[serde(rename = "lockedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub locked_at: Option<String>,

    /// Offer id field on promotion coupon wallet item.
    #[serde(rename = "offerId")]
    pub offer_id: String,

    /// Redeemed at field on promotion coupon wallet item.
    #[serde(rename = "redeemedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub redeemed_at: Option<String>,

    /// Returned at field on promotion coupon wallet item.
    #[serde(rename = "returnedAt")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub returned_at: Option<String>,

    /// Source code last 4 field on promotion coupon wallet item.
    #[serde(rename = "sourceCodeLast4")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_code_last4: Option<String>,

    /// Status field on promotion coupon wallet item.
    pub status: String,

    /// Stock id field on promotion coupon wallet item.
    #[serde(rename = "stockId")]
    pub stock_id: String,

    /// Valid from field on promotion coupon wallet item.
    #[serde(rename = "validFrom")]
    pub valid_from: String,
}
