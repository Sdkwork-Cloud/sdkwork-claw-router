from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargePackageItem:
    """Commerce recharge package item schema exposed by Claw Router."""
    bonus_points: int
    currency_code: str
    grant_amount: int
    id: str
    points: int
    price_amount: str
    name: Optional[str] = None
    package_no: Optional[str] = None
    sku_id: Optional[str] = None
    status: Optional[str] = None
    updated_at: Optional[str] = None
