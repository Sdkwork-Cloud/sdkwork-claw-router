from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_points_exchange_rate_response import CommercePointsExchangeRateResponse


@dataclass
class AccountPointsExchangeRateRetrieveResult:
    """Account points exchange rate retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePointsExchangeRateResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
