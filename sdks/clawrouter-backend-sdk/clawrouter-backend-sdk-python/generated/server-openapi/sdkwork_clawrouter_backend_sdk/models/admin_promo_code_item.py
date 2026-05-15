from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminPromoCodeItem:
    """Admin promo code item schema exposed by Claw Router."""
    batch_id: str
    code: str
    id: str
    status: str
    used_at: Optional[str] = None
    used_by: Optional[str] = None
