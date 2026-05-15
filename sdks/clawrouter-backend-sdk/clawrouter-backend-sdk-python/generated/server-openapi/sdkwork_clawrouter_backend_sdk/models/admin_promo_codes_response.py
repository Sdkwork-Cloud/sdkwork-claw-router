from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_promo_code_item import AdminPromoCodeItem


@dataclass
class AdminPromoCodesResponse:
    """Admin promo codes response schema exposed by Claw Router."""
    items: List[AdminPromoCodeItem]
