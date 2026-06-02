from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryLedgerRecord:
    """Commerce inventory ledger record schema exposed by Claw Router."""
    balance_after: str
    business_type: str
    created_at: str
    direction: str
    idempotency_key: str
    movement_no: str
    quantity: str
    sku_id: str
    source_id: str
    source_type: str
    tenant_id: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
    warehouse_id: Optional[str] = None
