from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminPaymentAttemptItem:
    """Admin payment attempt item schema exposed by Claw Router."""
    amount: str
    created_at: str
    id: str
    order_no: str
    provider: str
    status: str
