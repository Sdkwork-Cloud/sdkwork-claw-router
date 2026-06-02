from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminRechargePackageItem:
    """Admin recharge package item schema exposed by Claw Router."""
    bonus_points: int
    currency_code: str
    grant_amount: int
    id: str
    package_no: str
    points: int
    price_amount: str
    sku_id: str
    status: str
    updated_at: str
    name: Optional[str] = None
