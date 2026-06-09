from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_department_item import IamDepartmentItem


@dataclass
class IamDepartmentListResponse:
    """Iam department list response schema exposed by Claw Router."""
    items: List[IamDepartmentItem]
