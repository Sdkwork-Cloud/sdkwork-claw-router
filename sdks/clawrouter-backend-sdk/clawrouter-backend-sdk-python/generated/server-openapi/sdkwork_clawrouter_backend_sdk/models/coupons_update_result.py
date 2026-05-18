from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_coupon_mutation_response import AdminCouponMutationResponse


@dataclass
class CouponsUpdateResult:
    """Coupons update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCouponMutationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
