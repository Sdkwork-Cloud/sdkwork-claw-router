from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCouponItem:
    """Persisted coupon snapshot returned by the backend."""
    id: str
    name: str
    status: str
    type: str
    value: str
