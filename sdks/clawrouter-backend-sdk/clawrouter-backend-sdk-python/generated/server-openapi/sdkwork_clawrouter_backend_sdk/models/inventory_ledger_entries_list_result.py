from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_inventory_ledger_list_response import CommerceInventoryLedgerListResponse


@dataclass
class InventoryLedgerEntriesListResult:
    """Inventory ledger entries list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceInventoryLedgerListResponse] = None
    msg: Optional[str] = None
