from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminRechargePackageMutationResponse:
    """Admin recharge package mutation response schema exposed by Claw Router."""
    item: Dict[str, Any]
