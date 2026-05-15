use serde::{Deserialize, Serialize};

/// Ops referral stat snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OpsReferralStatSnapshotRecord {
    /// Created at field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,

    /// Currency field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency: Option<String>,

    /// Direct invited count field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub direct_invited_count: Option<String>,

    /// Id field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Invitation code field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invitation_code: Option<String>,

    /// Invitation code id field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invitation_code_id: Option<String>,

    /// Invite link field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub invite_link: Option<String>,

    /// Inviter email snapshot field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inviter_email_snapshot: Option<String>,

    /// Inviter name snapshot field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inviter_name_snapshot: Option<String>,

    /// Inviter user id field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub inviter_user_id: Option<String>,

    /// Metadata field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub metadata: Option<std::collections::HashMap<String, String>>,

    /// Organization id field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Paid invitee count field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub paid_invitee_count: Option<String>,

    /// Period end field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_end: Option<String>,

    /// Period start field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub period_start: Option<String>,

    /// Rebuild version field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rebuild_version: Option<String>,

    /// Reward awarded amount field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reward_awarded_amount: Option<String>,

    /// Reward pending amount field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub reward_pending_amount: Option<String>,

    /// Secondary invited count field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub secondary_invited_count: Option<String>,

    /// Snapshot at field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub snapshot_at: Option<String>,

    /// Snapshot period field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub snapshot_period: Option<String>,

    /// Source id field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_id: Option<String>,

    /// Source type field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_type: Option<String>,

    /// Source version field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_version: Option<String>,

    /// Status field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,

    /// Tenant id field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tenant_id: Option<String>,

    /// Total invited count field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_invited_count: Option<String>,

    /// Total revenue amount field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub total_revenue_amount: Option<String>,

    /// Updated at field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,

    /// Uuid field on ops referral stat snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub uuid: Option<String>,
}
