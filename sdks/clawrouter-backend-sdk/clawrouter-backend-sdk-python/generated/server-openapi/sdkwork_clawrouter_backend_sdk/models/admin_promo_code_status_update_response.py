from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminPromoCodeStatusUpdateResponse:
    """Admin promo code status update response schema exposed by Claw Router."""
    updated: bool
