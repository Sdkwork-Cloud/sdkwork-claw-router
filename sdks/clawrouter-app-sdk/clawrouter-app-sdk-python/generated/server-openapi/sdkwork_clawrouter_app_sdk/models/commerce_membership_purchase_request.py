from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipPurchaseRequest:
    """Commerce membership purchase request schema exposed by Claw Router."""
    package_id: int
    coupon_id: Optional[str] = None
