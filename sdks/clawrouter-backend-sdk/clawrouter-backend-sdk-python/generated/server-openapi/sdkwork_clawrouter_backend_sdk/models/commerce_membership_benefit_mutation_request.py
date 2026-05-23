from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipBenefitMutationRequest:
    """Commerce membership benefit mutation request schema exposed by Claw Router."""
    name: str
    benefit_key: Optional[str] = None
    claimed: Optional[bool] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    id: Optional[int] = None
    type: Optional[str] = None
    usage_limit: Optional[int] = None
    used_count: Optional[int] = None
