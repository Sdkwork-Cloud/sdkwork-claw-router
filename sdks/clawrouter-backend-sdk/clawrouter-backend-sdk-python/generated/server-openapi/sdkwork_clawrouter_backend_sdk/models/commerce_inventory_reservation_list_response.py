from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_inventory_reservation_item import CommerceInventoryReservationItem


@dataclass
class CommerceInventoryReservationListResponse:
    """Commerce inventory reservation list response schema exposed by Claw Router."""
    items: List[CommerceInventoryReservationItem]
    page: str
    page_size: str
    total: str
