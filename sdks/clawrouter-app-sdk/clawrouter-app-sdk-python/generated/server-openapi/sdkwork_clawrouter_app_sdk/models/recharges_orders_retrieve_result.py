from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_recharge_checkout_status_response import CommerceRechargeCheckoutStatusResponse


@dataclass
class RechargesOrdersRetrieveResult:
    """Recharges orders retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceRechargeCheckoutStatusResponse] = None
    msg: Optional[str] = None
