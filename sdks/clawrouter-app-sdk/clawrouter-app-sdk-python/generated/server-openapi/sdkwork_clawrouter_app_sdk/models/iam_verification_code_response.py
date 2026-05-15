from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamVerificationCodeResponse:
    """Iam verification code response schema exposed by Claw Router."""
    code_id: Optional[str] = None
    debug_code: Optional[str] = None
    expires_at: Optional[str] = None
