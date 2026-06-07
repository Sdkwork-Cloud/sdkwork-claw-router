from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_recharge_package_item import AdminRechargePackageItem


@dataclass
class AdminRechargePackageListResponse:
    """Admin recharge package list response schema exposed by Claw Router."""
    items: List[AdminRechargePackageItem]
