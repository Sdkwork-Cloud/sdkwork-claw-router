from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_department_list_response import IamDepartmentListResponse


@dataclass
class DepartmentsListResult:
    """Departments list result schema exposed by Claw Router."""
    code: str
    data: Optional[IamDepartmentListResponse] = None
    msg: Optional[str] = None
