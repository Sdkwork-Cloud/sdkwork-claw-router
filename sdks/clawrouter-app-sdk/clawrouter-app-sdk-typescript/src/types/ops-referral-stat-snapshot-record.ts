import type { JsonValue } from './json-value';

/** Ops referral stat snapshot record schema exposed by Claw Router. */
export interface OpsReferralStatSnapshotRecord {
  /** Created at field on ops referral stat snapshot record. */
  created_at?: string;
  /** Currency field on ops referral stat snapshot record. */
  currency?: string;
  /** Direct invited count field on ops referral stat snapshot record. */
  direct_invited_count?: string;
  /** Id field on ops referral stat snapshot record. */
  id?: string;
  /** Invitation code field on ops referral stat snapshot record. */
  invitation_code?: string;
  /** Invitation code id field on ops referral stat snapshot record. */
  invitation_code_id?: string;
  /** Invite link field on ops referral stat snapshot record. */
  invite_link?: string;
  /** Inviter email snapshot field on ops referral stat snapshot record. */
  inviter_email_snapshot?: string;
  /** Inviter name snapshot field on ops referral stat snapshot record. */
  inviter_name_snapshot?: string;
  /** Inviter user id field on ops referral stat snapshot record. */
  inviter_user_id?: string;
  /** Metadata field on ops referral stat snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops referral stat snapshot record. */
  organization_id?: string;
  /** Paid invitee count field on ops referral stat snapshot record. */
  paid_invitee_count?: string;
  /** Period end field on ops referral stat snapshot record. */
  period_end?: string;
  /** Period start field on ops referral stat snapshot record. */
  period_start?: string;
  /** Rebuild version field on ops referral stat snapshot record. */
  rebuild_version?: string;
  /** Reward awarded amount field on ops referral stat snapshot record. */
  reward_awarded_amount?: string;
  /** Reward pending amount field on ops referral stat snapshot record. */
  reward_pending_amount?: string;
  /** Secondary invited count field on ops referral stat snapshot record. */
  secondary_invited_count?: string;
  /** Snapshot at field on ops referral stat snapshot record. */
  snapshot_at?: string;
  /** Snapshot period field on ops referral stat snapshot record. */
  snapshot_period?: string;
  /** Source id field on ops referral stat snapshot record. */
  source_id?: string;
  /** Source type field on ops referral stat snapshot record. */
  source_type?: string;
  /** Source version field on ops referral stat snapshot record. */
  source_version?: string;
  /** Status field on ops referral stat snapshot record. */
  status?: string;
  /** Tenant id field on ops referral stat snapshot record. */
  tenant_id?: string;
  /** Total invited count field on ops referral stat snapshot record. */
  total_invited_count?: string;
  /** Total revenue amount field on ops referral stat snapshot record. */
  total_revenue_amount?: string;
  /** Updated at field on ops referral stat snapshot record. */
  updated_at?: string;
  /** Uuid field on ops referral stat snapshot record. */
  uuid?: string;
}
