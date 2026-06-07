from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_inventory_ledger_item import CommerceInventoryLedgerItem


@dataclass
class CommerceInventoryLedgerListResponse:
    """Commerce inventory ledger list response schema exposed by Claw Router."""
    items: List[CommerceInventoryLedgerItem]
    page: str
    page_size: str
    total: str
