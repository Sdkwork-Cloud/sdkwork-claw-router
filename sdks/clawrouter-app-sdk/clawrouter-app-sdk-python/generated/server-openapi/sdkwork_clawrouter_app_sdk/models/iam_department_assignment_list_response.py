from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_department_assignment_item import IamDepartmentAssignmentItem


@dataclass
class IamDepartmentAssignmentListResponse:
    """Iam department assignment list response schema exposed by Claw Router."""
    items: List[IamDepartmentAssignmentItem]
