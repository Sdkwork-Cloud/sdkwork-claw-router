from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_inventory_stock_item import CommerceInventoryStockItem


@dataclass
class CommerceInventoryStockMutationResponse:
    """Commerce inventory stock mutation response schema exposed by Claw Router."""
    item: CommerceInventoryStockItem
