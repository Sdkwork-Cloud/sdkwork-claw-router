from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_inventory_stock_mutation_response import CommerceInventoryStockMutationResponse


@dataclass
class InventoryStocksUpdateResult:
    """Inventory stocks update result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceInventoryStockMutationResponse] = None
    msg: Optional[str] = None
