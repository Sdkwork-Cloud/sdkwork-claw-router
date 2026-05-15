from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCouponUsageRequest:
    """Commerce coupon usage request schema exposed by Claw Router."""
    business_no: str
    request_no: str
    user_coupon_id: str
    amount: Optional[str] = None
