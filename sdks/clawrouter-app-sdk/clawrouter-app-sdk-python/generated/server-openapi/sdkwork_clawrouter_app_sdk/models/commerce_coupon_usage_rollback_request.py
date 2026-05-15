from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCouponUsageRollbackRequest:
    """Commerce coupon usage rollback request schema exposed by Claw Router."""
    request_no: str
    usage_no: str
    reason: Optional[str] = None
