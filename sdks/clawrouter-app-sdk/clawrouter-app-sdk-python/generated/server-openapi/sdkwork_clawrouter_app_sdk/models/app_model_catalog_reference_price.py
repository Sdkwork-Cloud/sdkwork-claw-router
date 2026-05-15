from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AppModelCatalogReferencePrice:
    """App model catalog reference price schema exposed by Claw Router."""
    billing_meter: str
    currency: str
    unit_price: str
