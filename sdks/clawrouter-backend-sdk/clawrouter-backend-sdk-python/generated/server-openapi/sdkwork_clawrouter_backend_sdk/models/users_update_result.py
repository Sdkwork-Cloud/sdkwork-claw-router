from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_user_mutation_response import AdminUserMutationResponse


@dataclass
class UsersUpdateResult:
    """Users update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminUserMutationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
