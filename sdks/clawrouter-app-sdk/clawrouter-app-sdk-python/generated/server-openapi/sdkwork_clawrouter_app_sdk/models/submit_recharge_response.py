from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SubmitRechargeResponse:
    """Submit recharge response schema exposed by Claw Router."""
    amount: str
    order_no: str
    payment_method: str
    points: int
    status: str
    success: bool
