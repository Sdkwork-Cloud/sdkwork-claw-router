from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipRecord:
    """Commerce membership record schema exposed by Claw Router."""
    created_at: str
    expires_at: str
    membership_no: str
    owner_user_id: str
    plan_id: str
    starts_at: str
    status: str
    tenant_id: str
    updated_at: str
    grace_until: Optional[str] = None
    organization_id: Optional[str] = None
    source_order_id: Optional[str] = None
    source_payment_intent_id: Optional[str] = None
