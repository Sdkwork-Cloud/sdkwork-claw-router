from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInventoryStockUpdateRequest:
    """Commerce inventory stock update request schema exposed by Claw Router."""
    version: str
    available_quantity: Optional[str] = None
    reason_code: Optional[str] = None
    reserved_quantity: Optional[str] = None
    status: Optional[str] = None
