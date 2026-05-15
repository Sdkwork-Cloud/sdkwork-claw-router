from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_points_balance_response import CommercePointsBalanceResponse


@dataclass
class VipPointsBalanceRetrieveResult:
    """Vip points balance retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePointsBalanceResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
