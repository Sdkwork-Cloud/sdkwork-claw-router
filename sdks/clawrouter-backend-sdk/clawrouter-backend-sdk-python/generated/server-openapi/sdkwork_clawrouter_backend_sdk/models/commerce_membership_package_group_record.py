from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipPackageGroupRecord:
    """Commerce membership package group record schema exposed by Claw Router."""
    created_at: str
    group_no: str
    name: str
    sort_order: str
    status: str
    tenant_id: str
    updated_at: str
    description: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    plan_id: Optional[str] = None
