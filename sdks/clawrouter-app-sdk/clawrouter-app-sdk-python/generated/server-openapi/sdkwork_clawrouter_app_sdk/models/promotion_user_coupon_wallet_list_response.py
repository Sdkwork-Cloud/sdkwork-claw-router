from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .promotion_coupon_wallet_item import PromotionCouponWalletItem


@dataclass
class PromotionUserCouponWalletListResponse:
    """Promotion user coupon wallet list response schema exposed by Claw Router."""
    items: List[PromotionCouponWalletItem]
