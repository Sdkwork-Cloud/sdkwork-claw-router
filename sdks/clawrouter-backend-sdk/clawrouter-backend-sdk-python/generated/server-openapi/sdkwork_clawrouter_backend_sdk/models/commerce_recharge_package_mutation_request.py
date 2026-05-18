from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargePackageMutationRequest:
    """Commerce recharge package mutation request schema exposed by Claw Router."""
    bonus: int
    rmb: str
    status: Optional[str] = None
