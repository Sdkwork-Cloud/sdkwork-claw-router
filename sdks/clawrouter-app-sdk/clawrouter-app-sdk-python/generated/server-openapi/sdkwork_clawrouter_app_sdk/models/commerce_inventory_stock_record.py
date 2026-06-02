from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryStockRecord:
    """Commerce inventory stock record schema exposed by Claw Router."""
    available_quantity: str
    created_at: str
    reserved_quantity: str
    sku_id: str
    sold_quantity: str
    status: str
    tenant_id: str
    updated_at: str
    version: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
    warehouse_id: Optional[str] = None
