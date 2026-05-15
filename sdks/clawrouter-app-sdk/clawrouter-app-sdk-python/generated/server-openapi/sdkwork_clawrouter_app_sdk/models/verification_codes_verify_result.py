from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_verification_code_verify_response import IamVerificationCodeVerifyResponse


@dataclass
class VerificationCodesVerifyResult:
    """Verification codes verify result schema exposed by Claw Router."""
    code: str
    data: Optional[IamVerificationCodeVerifyResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
