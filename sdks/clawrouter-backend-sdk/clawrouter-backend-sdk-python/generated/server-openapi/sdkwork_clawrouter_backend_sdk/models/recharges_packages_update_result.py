from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_recharge_package_mutation_response import AdminRechargePackageMutationResponse


@dataclass
class RechargesPackagesUpdateResult:
    """Recharges packages update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminRechargePackageMutationResponse] = None
    msg: Optional[str] = None
