from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipEntitlementUsageRecord:
    """Commerce membership entitlement usage record schema exposed by Claw Router."""
    created_at: str
    entitlement_id: str
    idempotency_key: str
    membership_id: str
    occurred_at: str
    owner_user_id: str
    source_id: str
    source_type: str
    tenant_id: str
    usage_no: str
    used_amount: str
    balance_after: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
