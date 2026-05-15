from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_promo_codes_response import AdminPromoCodesResponse


@dataclass
class CouponCodesListResult:
    """Coupon codes list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminPromoCodesResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
