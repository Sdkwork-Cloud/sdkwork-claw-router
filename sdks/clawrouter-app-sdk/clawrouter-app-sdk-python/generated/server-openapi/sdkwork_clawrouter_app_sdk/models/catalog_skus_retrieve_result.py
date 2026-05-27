from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_sku_response import CommerceProductSkuResponse


@dataclass
class CatalogSkusRetrieveResult:
    """Catalog skus retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductSkuResponse] = None
    msg: Optional[str] = None
