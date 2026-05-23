from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_intent_item import CommercePaymentIntentItem


@dataclass
class CommercePaymentIntentListResponse:
    """Commerce payment intent list response schema exposed by Claw Router."""
    items: List[CommercePaymentIntentItem]
    page: int
    page_size: int
    total: int
