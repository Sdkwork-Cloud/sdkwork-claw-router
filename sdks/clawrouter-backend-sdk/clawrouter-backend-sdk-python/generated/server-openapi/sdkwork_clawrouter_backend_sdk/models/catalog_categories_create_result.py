from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_category_mutation_response import CommerceProductCategoryMutationResponse


@dataclass
class CatalogCategoriesCreateResult:
    """Catalog categories create result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductCategoryMutationResponse] = None
    msg: Optional[str] = None
