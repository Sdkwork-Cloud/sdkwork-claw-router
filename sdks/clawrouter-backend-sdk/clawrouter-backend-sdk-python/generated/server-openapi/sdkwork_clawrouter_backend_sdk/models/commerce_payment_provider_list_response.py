from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_provider_item import CommercePaymentProviderItem


@dataclass
class CommercePaymentProviderListResponse:
    """Commerce payment provider list response schema exposed by Claw Router."""
    items: List[CommercePaymentProviderItem]
    page: str
    page_size: str
    total: str
