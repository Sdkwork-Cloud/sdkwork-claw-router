from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_price_list_item import CommercePriceListItem


@dataclass
class CommercePriceListMutationResponse:
    """Commerce price list mutation response schema exposed by Claw Router."""
    item: CommercePriceListItem
