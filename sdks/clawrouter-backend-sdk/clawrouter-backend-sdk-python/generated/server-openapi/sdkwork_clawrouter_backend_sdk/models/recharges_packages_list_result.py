from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .recharge_package import RechargePackage


@dataclass
class RechargesPackagesListResult:
    """Recharges packages list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[RechargePackage]] = None
    message: Optional[str] = None
    msg: Optional[str] = None
