from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamVerificationCodeVerifyRequest:
    """Iam verification code verify request schema exposed by Claw Router."""
    code: str
    scene: str
    target: str
    verify_type: str
    code_id: Optional[str] = None
