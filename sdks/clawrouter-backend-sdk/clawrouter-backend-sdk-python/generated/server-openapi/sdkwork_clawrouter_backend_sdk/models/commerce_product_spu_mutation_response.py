from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_spu_item import CommerceProductSpuItem


@dataclass
class CommerceProductSpuMutationResponse:
    """Commerce product spu mutation response schema exposed by Claw Router."""
    item: CommerceProductSpuItem
