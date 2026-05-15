from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .settlement_bill import SettlementBill
    from .settlement_chart_point import SettlementChartPoint


@dataclass
class SettlementDashboardResponse:
    """Settlement dashboard response schema exposed by Claw Router."""
    bills: List[SettlementBill]
    chart_data: List[SettlementChartPoint]
