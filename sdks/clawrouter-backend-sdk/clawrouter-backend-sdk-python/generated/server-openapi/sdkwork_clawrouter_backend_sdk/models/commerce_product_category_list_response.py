from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_category_item import CommerceProductCategoryItem


@dataclass
class CommerceProductCategoryListResponse:
    """Commerce product category list response schema exposed by Claw Router."""
    items: List[CommerceProductCategoryItem]
    page: int
    page_size: int
    total: int
