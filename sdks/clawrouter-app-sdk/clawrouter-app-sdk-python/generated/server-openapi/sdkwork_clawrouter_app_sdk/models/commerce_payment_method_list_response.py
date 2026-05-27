from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_method_item import CommercePaymentMethodItem


@dataclass
class CommercePaymentMethodListResponse:
    """Commerce payment method list response schema exposed by Claw Router."""
    items: List[CommercePaymentMethodItem]
    page: int
    page_size: int
    total: int
