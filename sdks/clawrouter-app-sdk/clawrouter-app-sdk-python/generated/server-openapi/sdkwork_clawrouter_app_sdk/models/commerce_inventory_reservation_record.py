from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryReservationRecord:
    """Commerce inventory reservation record schema exposed by Claw Router."""
    created_at: str
    expires_at: str
    idempotency_key: str
    reservation_no: str
    sku_id: str
    status: str
    tenant_id: str
    updated_at: str
    checkout_session_id: Optional[str] = None
    order_id: Optional[str] = None
    organization_id: Optional[str] = None
    warehouse_id: Optional[str] = None
