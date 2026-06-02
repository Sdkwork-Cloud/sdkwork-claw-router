from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargePackageMutationRequest:
    """Commerce recharge package mutation request schema exposed by Claw Router."""
    bonus_points: int
    currency_code: str
    price_amount: str
    status: Optional[str] = None
