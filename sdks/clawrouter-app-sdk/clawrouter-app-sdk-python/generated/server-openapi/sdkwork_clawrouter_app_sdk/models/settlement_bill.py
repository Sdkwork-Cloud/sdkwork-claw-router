from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .settlement_bill_breakdown import SettlementBillBreakdown


@dataclass
class SettlementBill:
    """Settlement bill schema exposed by Claw Router."""
    breakdown: SettlementBillBreakdown
    end_date: str
    id: str
    period: str
    start_date: str
    status: str
    total_cost: str
    total_tokens: str
