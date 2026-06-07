from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_inventory_reservation_list_response import CommerceInventoryReservationListResponse


@dataclass
class InventoryReservationsListResult:
    """Inventory reservations list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceInventoryReservationListResponse] = None
    msg: Optional[str] = None
