from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_coupon_batch_item import AdminCouponBatchItem
    from .admin_promo_code_item import AdminPromoCodeItem


@dataclass
class AdminCouponBatchGenerateResponse:
    """Admin coupon batch generate response schema exposed by Claw Router."""
    batch: AdminCouponBatchItem
    codes: List[AdminPromoCodeItem]
