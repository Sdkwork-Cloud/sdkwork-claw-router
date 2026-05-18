from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class RechargePackage:
    """Recharge package schema exposed by Claw Router."""
    bonus: int
    id: str
    points: int
    rmb: str
