from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_department_assignment_list_response import IamDepartmentAssignmentListResponse


@dataclass
class DepartmentAssignmentsListResult:
    """Department assignments list result schema exposed by Claw Router."""
    code: str
    data: Optional[IamDepartmentAssignmentListResponse] = None
    msg: Optional[str] = None
