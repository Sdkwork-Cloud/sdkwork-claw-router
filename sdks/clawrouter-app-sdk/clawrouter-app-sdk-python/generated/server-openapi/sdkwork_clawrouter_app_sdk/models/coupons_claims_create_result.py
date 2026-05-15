from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .billing_redeem_history_item import BillingRedeemHistoryItem


@dataclass
class CouponsClaimsCreateResult:
    """Coupons claims create result schema exposed by Claw Router."""
    code: str
    data: Optional[BillingRedeemHistoryItem] = None
    message: Optional[str] = None
    msg: Optional[str] = None
