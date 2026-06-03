from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_category_attribute_item import CommerceProductCategoryAttributeItem


@dataclass
class CommerceProductCategoryAttributeListResponse:
    """Commerce product category attribute list response schema exposed by Claw Router."""
    items: List[CommerceProductCategoryAttributeItem]
    page: int
    page_size: int
    total: int
