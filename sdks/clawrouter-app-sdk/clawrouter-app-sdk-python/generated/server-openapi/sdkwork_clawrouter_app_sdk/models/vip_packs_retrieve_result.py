from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_vip_pack_item import CommerceVipPackItem


@dataclass
class VipPacksRetrieveResult:
    """Vip packs retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceVipPackItem] = None
    message: Optional[str] = None
    msg: Optional[str] = None
