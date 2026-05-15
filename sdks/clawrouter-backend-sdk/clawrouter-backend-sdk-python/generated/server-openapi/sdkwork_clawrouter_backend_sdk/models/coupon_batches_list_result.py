from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_coupon_batches_response import AdminCouponBatchesResponse


@dataclass
class CouponBatchesListResult:
    """Coupon batches list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCouponBatchesResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
