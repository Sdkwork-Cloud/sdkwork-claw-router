from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_attribute_item import CommerceProductAttributeItem


@dataclass
class CommerceProductAttributeListResponse:
    """Commerce product attribute list response schema exposed by Claw Router."""
    items: List[CommerceProductAttributeItem]
    page: int
    page_size: int
    total: int
