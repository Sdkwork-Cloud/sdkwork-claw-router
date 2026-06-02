from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceFulfillmentOrderRecord:
    """Commerce fulfillment order record schema exposed by Claw Router."""
    created_at: str
    fulfillment_no: str
    fulfillment_type: str
    order_id: str
    status: str
    tenant_id: str
    updated_at: str
    address_snapshot_id: Optional[str] = None
    completed_at: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_code: Optional[str] = None
    warehouse_id: Optional[str] = None
