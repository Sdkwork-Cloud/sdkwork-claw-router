from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminUserBalanceAdjustmentRequest:
    """Admin user balance adjustment request schema exposed by Claw Router."""
    amount: float
    type: str
