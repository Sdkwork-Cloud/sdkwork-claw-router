from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_spu_mutation_response import CommerceProductSpuMutationResponse


@dataclass
class CatalogProductsUpdateResult:
    """Catalog products update result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductSpuMutationResponse] = None
    msg: Optional[str] = None
