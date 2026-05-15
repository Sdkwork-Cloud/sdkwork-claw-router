from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_password_reset_request_response import IamPasswordResetRequestResponse


@dataclass
class PasswordResetRequestsCreateResult:
    """Password reset requests create result schema exposed by Claw Router."""
    code: str
    data: Optional[IamPasswordResetRequestResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
