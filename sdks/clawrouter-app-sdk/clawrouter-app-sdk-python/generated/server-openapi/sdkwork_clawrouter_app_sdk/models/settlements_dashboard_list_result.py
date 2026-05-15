from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .settlement_dashboard_response import SettlementDashboardResponse


@dataclass
class SettlementsDashboardListResult:
    """Settlements dashboard list result schema exposed by Claw Router."""
    code: str
    data: Optional[SettlementDashboardResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
