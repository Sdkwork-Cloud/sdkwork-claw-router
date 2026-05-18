from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .recharge_package import RechargePackage


@dataclass
class AdminRechargePackageMutationResponse:
    """Admin recharge package mutation response schema exposed by Claw Router."""
    item: RechargePackage
