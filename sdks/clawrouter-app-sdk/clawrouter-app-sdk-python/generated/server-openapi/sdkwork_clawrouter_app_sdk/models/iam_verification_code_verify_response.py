from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamVerificationCodeVerifyResponse:
    """Iam verification code verify response schema exposed by Claw Router."""
    verified: bool
    valid: Optional[bool] = None
