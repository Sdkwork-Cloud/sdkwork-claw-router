from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_recharge_package_list_response import CommerceRechargePackageListResponse


@dataclass
class RechargesPackagesListResult:
    """Recharges packages list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceRechargePackageListResponse] = None
    msg: Optional[str] = None
