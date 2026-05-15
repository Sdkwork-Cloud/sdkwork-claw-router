from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsReferralStatSnapshotRecord:
    """Ops referral stat snapshot record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    currency: Optional[str] = None
    direct_invited_count: Optional[str] = None
    id: Optional[str] = None
    invitation_code: Optional[str] = None
    invitation_code_id: Optional[str] = None
    invite_link: Optional[str] = None
    inviter_email_snapshot: Optional[str] = None
    inviter_name_snapshot: Optional[str] = None
    inviter_user_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    paid_invitee_count: Optional[str] = None
    period_end: Optional[str] = None
    period_start: Optional[str] = None
    rebuild_version: Optional[str] = None
    reward_awarded_amount: Optional[str] = None
    reward_pending_amount: Optional[str] = None
    secondary_invited_count: Optional[str] = None
    snapshot_at: Optional[str] = None
    snapshot_period: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    total_invited_count: Optional[str] = None
    total_revenue_amount: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
