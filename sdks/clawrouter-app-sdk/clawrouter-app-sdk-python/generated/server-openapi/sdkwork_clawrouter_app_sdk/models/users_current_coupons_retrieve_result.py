from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .billing_redeem_history_item import BillingRedeemHistoryItem


@dataclass
class UsersCurrentCouponsRetrieveResult:
    """Users current coupons retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[BillingRedeemHistoryItem] = None
    msg: Optional[str] = None
