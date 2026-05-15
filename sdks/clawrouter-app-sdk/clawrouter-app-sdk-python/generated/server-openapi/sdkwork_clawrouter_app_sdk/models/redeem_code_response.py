from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class RedeemCodeResponse:
    """Redeem code response schema exposed by Claw Router."""
    amount: str
    balance: int
    credited_points: int
    message: str
