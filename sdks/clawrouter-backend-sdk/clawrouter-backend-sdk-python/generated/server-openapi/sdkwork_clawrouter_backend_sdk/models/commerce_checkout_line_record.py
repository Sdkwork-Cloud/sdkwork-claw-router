from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCheckoutLineRecord:
    """Commerce checkout line record schema exposed by Claw Router."""
    checkout_session_id: str
    created_at: str
    fulfillment_type: str
    purchase_type: str
    quantity: str
    sku_id: str
    tenant_id: str
    id: Optional[str] = None
    inventory_reservation_id: Optional[str] = None
    organization_id: Optional[str] = None
    price_snapshot_json: Optional[Dict[str, str]] = None
    promotion_snapshot_json: Optional[Dict[str, str]] = None
