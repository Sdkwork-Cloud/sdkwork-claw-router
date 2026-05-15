from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_points_history_item import CommercePointsHistoryItem


@dataclass
class AccountPointsHistoryListResult:
    """Account points history list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CommercePointsHistoryItem]] = None
    message: Optional[str] = None
    msg: Optional[str] = None
