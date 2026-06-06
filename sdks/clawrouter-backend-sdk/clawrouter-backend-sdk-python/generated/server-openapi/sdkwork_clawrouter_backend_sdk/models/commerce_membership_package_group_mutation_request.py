from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipPackageGroupMutationRequest:
    """Commerce membership package group mutation request schema exposed by Claw Router."""
    billing_cycle: str
    code: str
    duration_days: str
    name: str
    description: Optional[str] = None
    sort_weight: Optional[str] = None
    status: Optional[str] = None
