from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_vip_info_response import CommerceVipInfoResponse


@dataclass
class VipStatusRetrieveResult:
    """Vip status retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceVipInfoResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
