from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_sku_list_response import CommerceProductSkuListResponse


@dataclass
class CatalogSkusListResult:
    """Catalog skus list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductSkuListResponse] = None
    msg: Optional[str] = None
