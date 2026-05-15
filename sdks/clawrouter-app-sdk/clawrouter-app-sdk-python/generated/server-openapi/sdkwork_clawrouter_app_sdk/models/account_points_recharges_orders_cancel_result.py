from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_operation_response import CommerceOperationResponse


@dataclass
class AccountPointsRechargesOrdersCancelResult:
    """Account points recharges orders cancel result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceOperationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
