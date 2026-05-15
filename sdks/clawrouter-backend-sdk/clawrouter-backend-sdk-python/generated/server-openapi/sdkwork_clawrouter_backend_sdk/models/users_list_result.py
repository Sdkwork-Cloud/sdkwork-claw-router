from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_users_response import AdminUsersResponse


@dataclass
class UsersListResult:
    """Users list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminUsersResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
