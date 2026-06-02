from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_recharge_order_create_response import CommerceRechargeOrderCreateResponse


@dataclass
class RechargesOrdersCreateResult:
    """Recharges orders create result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceRechargeOrderCreateResponse] = None
    msg: Optional[str] = None
