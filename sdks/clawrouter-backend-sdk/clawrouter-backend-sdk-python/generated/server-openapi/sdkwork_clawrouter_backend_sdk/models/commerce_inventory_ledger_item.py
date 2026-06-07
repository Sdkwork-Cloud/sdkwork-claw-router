from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryLedgerItem:
    """Commerce inventory ledger item schema exposed by Claw Router."""
    balance_after: str
    business_type: str
    created_at: str
    direction: str
    id: str
    movement_no: str
    quantity: str
    sku_id: str
    source_id: str
    source_type: str
    warehouse_id: Optional[str] = None
