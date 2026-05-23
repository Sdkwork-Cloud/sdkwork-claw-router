from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryStockItem:
    """Commerce inventory stock item schema exposed by Claw Router."""
    available_quantity: int
    created_at: str
    id: str
    reserved_quantity: int
    sku_id: str
    sold_quantity: int
    status: str
    updated_at: str
    version: int
    warehouse_id: Optional[str] = None
