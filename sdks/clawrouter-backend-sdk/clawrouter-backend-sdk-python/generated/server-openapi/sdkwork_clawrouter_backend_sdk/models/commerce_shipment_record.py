from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceShipmentRecord:
    """Commerce shipment record schema exposed by Claw Router."""
    carrier_code: str
    created_at: str
    fulfillment_id: str
    shipment_no: str
    status: str
    tenant_id: str
    tracking_no: str
    updated_at: str
    delivered_at: Optional[str] = None
    organization_id: Optional[str] = None
    shipped_at: Optional[str] = None
