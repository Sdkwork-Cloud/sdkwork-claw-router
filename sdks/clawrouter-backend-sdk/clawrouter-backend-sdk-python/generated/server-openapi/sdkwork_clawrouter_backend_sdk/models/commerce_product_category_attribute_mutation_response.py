from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_category_attribute_item import CommerceProductCategoryAttributeItem


@dataclass
class CommerceProductCategoryAttributeMutationResponse:
    """Commerce product category attribute mutation response schema exposed by Claw Router."""
    item: CommerceProductCategoryAttributeItem
