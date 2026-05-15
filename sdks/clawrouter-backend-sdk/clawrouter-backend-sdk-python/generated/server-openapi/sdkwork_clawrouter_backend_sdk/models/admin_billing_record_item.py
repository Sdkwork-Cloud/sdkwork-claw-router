from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminBillingRecordItem:
    """Admin billing record item schema exposed by Claw Router."""
    due_date: str
    id: str
    period: str
    status: str
    total_cost: str
    total_tokens: int
    user_id: str
