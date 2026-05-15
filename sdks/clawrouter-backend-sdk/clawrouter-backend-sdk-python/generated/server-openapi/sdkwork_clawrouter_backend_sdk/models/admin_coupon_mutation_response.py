from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_coupon_item import AdminCouponItem


@dataclass
class AdminCouponMutationResponse:
    """Admin coupon mutation response schema exposed by Claw Router."""
    item: AdminCouponItem
