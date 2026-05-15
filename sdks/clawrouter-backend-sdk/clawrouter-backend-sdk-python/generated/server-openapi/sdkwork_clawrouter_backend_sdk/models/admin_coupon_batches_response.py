from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_coupon_batch_item import AdminCouponBatchItem


@dataclass
class AdminCouponBatchesResponse:
    """Admin coupon batches response schema exposed by Claw Router."""
    items: List[AdminCouponBatchItem]
