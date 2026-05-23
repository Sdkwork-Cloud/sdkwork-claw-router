from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .submit_recharge_response import SubmitRechargeResponse


@dataclass
class AccountPointsRechargesCreateResult:
    """Account points recharges create result schema exposed by Claw Router."""
    code: str
    data: Optional[SubmitRechargeResponse] = None
    msg: Optional[str] = None
