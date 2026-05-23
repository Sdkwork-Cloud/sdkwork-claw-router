from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_inventory_stock_item import CommerceInventoryStockItem


@dataclass
class CommerceInventoryStockListResponse:
    """Commerce inventory stock list response schema exposed by Claw Router."""
    items: List[CommerceInventoryStockItem]
    page: int
    page_size: int
    total: int
