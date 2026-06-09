from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_role_binding_list_response import IamRoleBindingListResponse


@dataclass
class RoleBindingsListResult:
    """Role bindings list result schema exposed by Claw Router."""
    code: str
    data: Optional[IamRoleBindingListResponse] = None
    msg: Optional[str] = None
