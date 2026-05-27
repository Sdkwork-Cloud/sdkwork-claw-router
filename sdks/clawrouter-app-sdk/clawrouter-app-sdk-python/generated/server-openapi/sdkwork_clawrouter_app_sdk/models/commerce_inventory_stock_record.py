from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryStockRecord:
    """Commerce inventory stock record schema exposed by Claw Router."""
    created_at: str
    sku_id: str
    status: str
    tenant_id: str
    updated_at: str
    organization_id: Optional[str] = None
    warehouse_id: Optional[str] = None
