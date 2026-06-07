from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryReservationItem:
    """Commerce inventory reservation item schema exposed by Claw Router."""
    created_at: str
    expires_at: str
    id: str
    quantity: str
    reservation_no: str
    sku_id: str
    status: str
    checkout_session_id: Optional[str] = None
    order_id: Optional[str] = None
