from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_provider_account_item import CommercePaymentProviderAccountItem


@dataclass
class CommercePaymentProviderAccountListResponse:
    """Commerce payment provider account list response schema exposed by Claw Router."""
    items: List[CommercePaymentProviderAccountItem]
    page: str
    page_size: str
    total: str
