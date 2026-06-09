from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_position_assignment_list_response import IamPositionAssignmentListResponse


@dataclass
class PositionAssignmentsListResult:
    """Position assignments list result schema exposed by Claw Router."""
    code: str
    data: Optional[IamPositionAssignmentListResponse] = None
    msg: Optional[str] = None
