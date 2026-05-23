from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryStockUpdateRequest:
    """Commerce inventory stock update request schema exposed by Claw Router."""
    version: int
    available_quantity: Optional[int] = None
    reason_code: Optional[str] = None
    reserved_quantity: Optional[int] = None
    status: Optional[str] = None
