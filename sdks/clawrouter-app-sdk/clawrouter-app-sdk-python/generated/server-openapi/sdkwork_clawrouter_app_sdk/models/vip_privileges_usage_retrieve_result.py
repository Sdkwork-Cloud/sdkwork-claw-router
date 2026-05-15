from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_vip_privilege_usage_item import CommerceVipPrivilegeUsageItem


@dataclass
class VipPrivilegesUsageRetrieveResult:
    """Vip privileges usage retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CommerceVipPrivilegeUsageItem]] = None
    message: Optional[str] = None
    msg: Optional[str] = None
