from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_access_groups_response import AdminAccessGroupsResponse


@dataclass
class AccessGroupsListResult:
    """Access groups list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAccessGroupsResponse] = None
    msg: Optional[str] = None
