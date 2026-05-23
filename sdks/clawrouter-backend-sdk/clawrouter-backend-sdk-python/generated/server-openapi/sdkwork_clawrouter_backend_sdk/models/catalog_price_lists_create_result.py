from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_price_list_mutation_response import CommercePriceListMutationResponse


@dataclass
class CatalogPriceListsCreateResult:
    """Catalog price lists create result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePriceListMutationResponse] = None
    msg: Optional[str] = None
