from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_session_response import IamSessionResponse
    from .iam_user_response import IamUserResponse


@dataclass
class IamLoginQrCodeStatusResponse:
    """Iam login qr code status response schema exposed by Claw Router."""
    status: str
    session: Optional[IamSessionResponse] = None
    token: Optional[IamSessionResponse] = None
    user_info: Optional[IamUserResponse] = None
