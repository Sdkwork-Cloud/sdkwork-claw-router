from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCouponBatchItem:
    """Persisted coupon batch snapshot returned by the backend."""
    count: int
    coupon_id: str
    created_at: str
    id: str
    name: str
    prefix: str
