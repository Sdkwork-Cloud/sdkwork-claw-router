from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCouponClaimRequest:
    """Commerce coupon claim request schema exposed by Claw Router."""
    coupon_id: str
    claim_source: Optional[str] = None
