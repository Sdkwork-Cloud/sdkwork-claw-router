from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .settlement_bill_breakdown_item import SettlementBillBreakdownItem


@dataclass
class SettlementBillBreakdown:
    """Settlement bill breakdown schema exposed by Claw Router."""
    audio: SettlementBillBreakdownItem
    image: SettlementBillBreakdownItem
    music: SettlementBillBreakdownItem
    text: SettlementBillBreakdownItem
    video: SettlementBillBreakdownItem
