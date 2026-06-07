from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_recharge_package_list_response import AdminRechargePackageListResponse


@dataclass
class RechargesPackagesListResult:
    """Recharges packages list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminRechargePackageListResponse] = None
    msg: Optional[str] = None
