from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_coupon_batch_generate_response import AdminCouponBatchGenerateResponse


@dataclass
class CouponBatchesCreateResult:
    """Coupon batches create result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCouponBatchGenerateResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
