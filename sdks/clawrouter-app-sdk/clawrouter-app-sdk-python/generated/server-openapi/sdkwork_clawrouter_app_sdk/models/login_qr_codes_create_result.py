from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_login_qr_code_response import IamLoginQrCodeResponse


@dataclass
class LoginQrCodesCreateResult:
    """Login qr codes create result schema exposed by Claw Router."""
    code: str
    data: Optional[IamLoginQrCodeResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
