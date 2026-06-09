from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_position_assignment_item import IamPositionAssignmentItem


@dataclass
class IamPositionAssignmentListResponse:
    """Iam position assignment list response schema exposed by Claw Router."""
    items: List[IamPositionAssignmentItem]
