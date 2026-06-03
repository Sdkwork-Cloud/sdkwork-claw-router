from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_category_attribute_list_response import CommerceProductCategoryAttributeListResponse


@dataclass
class CatalogCategoryAttributesListResult:
    """Catalog category attributes list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductCategoryAttributeListResponse] = None
    msg: Optional[str] = None
