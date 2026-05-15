from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_vip_pack_group_item import CommerceVipPackGroupItem


@dataclass
class VipPackGroupsRetrieveResult:
    """Vip pack groups retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceVipPackGroupItem] = None
    message: Optional[str] = None
    msg: Optional[str] = None
