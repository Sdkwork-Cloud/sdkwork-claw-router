from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipPlanRecord:
    """Commerce membership plan record schema exposed by Claw Router."""
    created_at: str
    level_code: str
    name: str
    plan_no: str
    sort_order: str
    status: str
    tenant_id: str
    updated_at: str
    benefits_json: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
