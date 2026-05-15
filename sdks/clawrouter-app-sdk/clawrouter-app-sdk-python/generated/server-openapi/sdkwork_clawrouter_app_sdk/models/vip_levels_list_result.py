from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_vip_level_item import CommerceVipLevelItem


@dataclass
class VipLevelsListResult:
    """Vip levels list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CommerceVipLevelItem]] = None
    message: Optional[str] = None
    msg: Optional[str] = None
