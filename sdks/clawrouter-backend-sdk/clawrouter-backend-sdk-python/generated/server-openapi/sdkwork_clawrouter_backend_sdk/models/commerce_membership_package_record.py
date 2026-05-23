from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipPackageRecord:
    """Commerce membership package record schema exposed by Claw Router."""
    created_at: str
    currency_code: str
    duration_days: str
    package_no: str
    plan_id: str
    price_amount: str
    sku_id: str
    status: str
    tenant_id: str
    updated_at: str
    ends_at: Optional[str] = None
    organization_id: Optional[str] = None
    package_group_id: Optional[str] = None
    recurrence_cycle: Optional[str] = None
    starts_at: Optional[str] = None
