from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_vip_benefit_item import CommerceVipBenefitItem


@dataclass
class VipBenefitsListResult:
    """Vip benefits list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CommerceVipBenefitItem]] = None
    message: Optional[str] = None
    msg: Optional[str] = None
