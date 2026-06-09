from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamVerificationCodeCreateRequest:
    """Iam verification code create request schema exposed by Claw Router."""
    scene: str
    target: str
    verify_type: str
