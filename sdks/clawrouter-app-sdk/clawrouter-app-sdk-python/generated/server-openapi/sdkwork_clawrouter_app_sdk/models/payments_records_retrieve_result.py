from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .billing_recharge_history_item import BillingRechargeHistoryItem


@dataclass
class PaymentsRecordsRetrieveResult:
    """Payments records retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[BillingRechargeHistoryItem] = None
    message: Optional[str] = None
    msg: Optional[str] = None
