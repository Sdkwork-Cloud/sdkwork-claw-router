from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_user_response import IamUserResponse


@dataclass
class UsersCurrentRetrieveResult:
    """Users current retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[IamUserResponse] = None
    msg: Optional[str] = None
