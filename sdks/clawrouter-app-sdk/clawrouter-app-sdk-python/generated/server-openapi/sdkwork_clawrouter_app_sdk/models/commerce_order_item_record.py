from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceOrderItemRecord:
    """Commerce order item record schema exposed by Claw Router."""
    created_at: str
    order_id: str
    quantity: str
    sku_id: str
    tenant_id: str
    title: str
    total_amount: str
    unit_price_amount: str
    id: Optional[str] = None
