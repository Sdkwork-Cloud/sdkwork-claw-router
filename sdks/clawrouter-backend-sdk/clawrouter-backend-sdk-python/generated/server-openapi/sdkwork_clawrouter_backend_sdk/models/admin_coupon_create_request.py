from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCouponCreateRequest:
    """Admin coupon create request schema exposed by Claw Router."""
    name: str
    type: str
    value: str
    status: Optional[str] = None
