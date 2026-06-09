from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_app_context import IamAppContext
    from .iam_user_response import IamUserResponse


@dataclass
class IamSessionResponse:
    """Iam session response schema exposed by Claw Router."""
    access_token: str
    auth_token: str
    context: IamAppContext
    user: IamUserResponse
    expires_at: Optional[str] = None
    refresh_token: Optional[str] = None
    session_id: Optional[str] = None
