from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .promotion_user_coupon_wallet_list_response import PromotionUserCouponWalletListResponse


@dataclass
class PromotionsUserCouponsWalletListResult:
    """Promotions user coupons wallet list result schema exposed by Claw Router."""
    code: str
    data: Optional[PromotionUserCouponWalletListResponse] = None
    msg: Optional[str] = None
