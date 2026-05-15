from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCouponCatalogItem:
    """Commerce coupon catalog item schema exposed by Claw Router."""
    id: str
    name: str
    status: str
    type: str
    value: str
