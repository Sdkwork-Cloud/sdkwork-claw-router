from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipPackageMutationRequest:
    """Commerce membership package mutation request schema exposed by Claw Router."""
    code: str
    duration_days: str
    name: str
    package_group_id: str
    plan_id: str
    price_amount: str
    currency_code: Optional[str] = None
    status: Optional[str] = None
