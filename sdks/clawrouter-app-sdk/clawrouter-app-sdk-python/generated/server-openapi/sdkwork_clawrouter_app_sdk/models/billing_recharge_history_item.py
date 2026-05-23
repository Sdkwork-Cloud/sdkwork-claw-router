from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class BillingRechargeHistoryItem:
    """Billing recharge history item schema exposed by Claw Router."""
    amount: str
    date: str
    id: str
    method: str
    order_no: str
    status: str
