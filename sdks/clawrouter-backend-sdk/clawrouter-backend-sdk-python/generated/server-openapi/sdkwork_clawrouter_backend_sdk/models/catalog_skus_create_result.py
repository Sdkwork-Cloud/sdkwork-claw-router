from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_sku_mutation_response import CommerceProductSkuMutationResponse


@dataclass
class CatalogSkusCreateResult:
    """Catalog skus create result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductSkuMutationResponse] = None
    msg: Optional[str] = None
