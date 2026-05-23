from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_category_item import CommerceProductCategoryItem


@dataclass
class CommerceProductCategoryMutationResponse:
    """Commerce product category mutation response schema exposed by Claw Router."""
    item: CommerceProductCategoryItem
