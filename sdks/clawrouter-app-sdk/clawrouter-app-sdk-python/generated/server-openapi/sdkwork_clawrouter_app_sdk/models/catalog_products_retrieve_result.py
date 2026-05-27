from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_spu_detail_response import CommerceProductSpuDetailResponse


@dataclass
class CatalogProductsRetrieveResult:
    """Catalog products retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductSpuDetailResponse] = None
    msg: Optional[str] = None
