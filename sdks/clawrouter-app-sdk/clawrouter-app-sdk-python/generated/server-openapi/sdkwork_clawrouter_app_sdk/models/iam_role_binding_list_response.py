from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_role_binding_item import IamRoleBindingItem


@dataclass
class IamRoleBindingListResponse:
    """Iam role binding list response schema exposed by Claw Router."""
    items: List[IamRoleBindingItem]
