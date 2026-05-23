from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_sku_item import CommerceProductSkuItem


@dataclass
class CommerceProductSkuMutationResponse:
    """Commerce product sku mutation response schema exposed by Claw Router."""
    item: CommerceProductSkuItem
