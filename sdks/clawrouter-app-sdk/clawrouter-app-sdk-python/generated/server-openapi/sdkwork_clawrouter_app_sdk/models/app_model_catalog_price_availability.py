from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AppModelCatalogPriceAvailability:
    """App model catalog price availability schema exposed by Claw Router."""
    status: str
    reason: Optional[str] = None
