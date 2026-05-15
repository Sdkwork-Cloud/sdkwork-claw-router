from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCouponBatchGenerateRequest:
    """Admin coupon batch generate request schema exposed by Claw Router."""
    count: int
    coupon_id: int
    name: str
    prefix: str
