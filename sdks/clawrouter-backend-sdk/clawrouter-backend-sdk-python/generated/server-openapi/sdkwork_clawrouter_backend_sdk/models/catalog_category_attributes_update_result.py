from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_category_attribute_mutation_response import CommerceProductCategoryAttributeMutationResponse


@dataclass
class CatalogCategoryAttributesUpdateResult:
    """Catalog category attributes update result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductCategoryAttributeMutationResponse] = None
    msg: Optional[str] = None
