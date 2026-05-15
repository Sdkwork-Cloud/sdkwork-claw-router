from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .redeem_code_response import RedeemCodeResponse


@dataclass
class CouponsRedeemCreateResult:
    """Coupons redeem create result schema exposed by Claw Router."""
    code: str
    data: Optional[RedeemCodeResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
