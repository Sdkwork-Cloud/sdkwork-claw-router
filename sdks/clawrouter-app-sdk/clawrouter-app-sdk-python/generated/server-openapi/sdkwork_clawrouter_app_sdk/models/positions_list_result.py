from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_position_list_response import IamPositionListResponse


@dataclass
class PositionsListResult:
    """Positions list result schema exposed by Claw Router."""
    code: str
    data: Optional[IamPositionListResponse] = None
    msg: Optional[str] = None
