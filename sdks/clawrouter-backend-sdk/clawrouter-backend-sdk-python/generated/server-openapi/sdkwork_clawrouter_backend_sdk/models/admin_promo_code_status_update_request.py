from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminPromoCodeStatusUpdateRequest:
    """Admin promo code status update request schema exposed by Claw Router."""
    status: str
