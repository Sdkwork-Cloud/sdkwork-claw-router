from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_spu_item import CommerceProductSpuItem


@dataclass
class CommerceProductSpuListResponse:
    """Commerce product spu list response schema exposed by Claw Router."""
    items: List[CommerceProductSpuItem]
    page: int
    page_size: int
    total: int
