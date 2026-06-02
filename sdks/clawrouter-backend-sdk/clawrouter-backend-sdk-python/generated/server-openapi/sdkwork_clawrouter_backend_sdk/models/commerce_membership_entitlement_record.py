from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipEntitlementRecord:
    """Commerce membership entitlement record schema exposed by Claw Router."""
    created_at: str
    entitlement_code: str
    name: str
    quota_amount: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
    plan_id: Optional[str] = None
    quota_period: Optional[str] = None
    reset_policy: Optional[str] = None
