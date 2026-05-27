from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_intent_item import CommercePaymentIntentItem


@dataclass
class CommercePaymentIntentResponse:
    """Commerce payment intent response schema exposed by Claw Router."""
    item: CommercePaymentIntentItem
