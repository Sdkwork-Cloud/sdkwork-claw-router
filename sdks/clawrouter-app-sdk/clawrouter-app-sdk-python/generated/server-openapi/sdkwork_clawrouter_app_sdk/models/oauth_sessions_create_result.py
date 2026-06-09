from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_session_response import IamSessionResponse


@dataclass
class OauthSessionsCreateResult:
    """Oauth sessions create result schema exposed by Claw Router."""
    code: str
    data: Optional[IamSessionResponse] = None
    msg: Optional[str] = None
