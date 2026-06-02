from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceFulfillmentItemRecord:
    """Commerce fulfillment item record schema exposed by Claw Router."""
    created_at: str
    fulfillment_id: str
    order_item_id: str
    quantity: str
    sku_id: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
