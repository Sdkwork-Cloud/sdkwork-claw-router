from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_price_list_response import CommercePriceListResponse


@dataclass
class CatalogPriceListsListResult:
    """Catalog price lists list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePriceListResponse] = None
    msg: Optional[str] = None
