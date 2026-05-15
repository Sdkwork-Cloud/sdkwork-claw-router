from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class BillingRedeemHistoryItem:
    """Billing redeem history item schema exposed by Claw Router."""
    amount: str
    code: str
    date: str
    id: int
    status: str
