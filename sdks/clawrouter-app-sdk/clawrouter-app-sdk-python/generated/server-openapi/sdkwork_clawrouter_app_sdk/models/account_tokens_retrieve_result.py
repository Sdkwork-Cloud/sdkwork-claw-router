from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_token_balance_response import CommerceTokenBalanceResponse


@dataclass
class AccountTokensRetrieveResult:
    """Account tokens retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceTokenBalanceResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
