from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_verification_code_response import IamVerificationCodeResponse


@dataclass
class VerificationCodesCreateResult:
    """Verification codes create result schema exposed by Claw Router."""
    code: str
    data: Optional[IamVerificationCodeResponse] = None
    msg: Optional[str] = None
