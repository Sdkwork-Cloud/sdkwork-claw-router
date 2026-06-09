from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_department_tree_response import IamDepartmentTreeResponse


@dataclass
class DepartmentsTreeRetrieveResult:
    """Departments tree retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[IamDepartmentTreeResponse] = None
    msg: Optional[str] = None
