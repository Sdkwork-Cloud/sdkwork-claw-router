from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceDigitalDeliveryRecord:
    """Commerce digital delivery record schema exposed by Claw Router."""
    created_at: str
    delivery_no: str
    delivery_ref: str
    delivery_type: str
    fulfillment_id: str
    order_item_id: str
    status: str
    tenant_id: str
    updated_at: str
    delivered_at: Optional[str] = None
    organization_id: Optional[str] = None
