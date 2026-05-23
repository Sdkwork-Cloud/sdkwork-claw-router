from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_access_group_mutation_response import AdminAccessGroupMutationResponse


@dataclass
class AccessGroupsCreateResult:
    """Access groups create result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAccessGroupMutationResponse] = None
    msg: Optional[str] = None
