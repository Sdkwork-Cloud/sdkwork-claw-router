from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_promo_code_status_update_response import AdminPromoCodeStatusUpdateResponse


@dataclass
class CouponCodesStatusUpdateResult:
    """Coupon codes status update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminPromoCodeStatusUpdateResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
