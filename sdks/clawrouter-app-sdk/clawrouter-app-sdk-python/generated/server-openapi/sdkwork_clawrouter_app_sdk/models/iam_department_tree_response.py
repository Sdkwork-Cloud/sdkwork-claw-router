from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_department_tree_item import IamDepartmentTreeItem


@dataclass
class IamDepartmentTreeResponse:
    """Iam department tree response schema exposed by Claw Router."""
    items: List[IamDepartmentTreeItem]
