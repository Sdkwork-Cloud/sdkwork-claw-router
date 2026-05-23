from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_price_list_item import CommercePriceListItem


@dataclass
class CommercePriceListResponse:
    """Commerce price list response schema exposed by Claw Router."""
    items: List[CommercePriceListItem]
    page: int
    page_size: int
    total: int
