from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .auth_verification_policy import AuthVerificationPolicy


@dataclass
class IamVerificationPolicyRetrieveResult:
    """Iam verification policy retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AuthVerificationPolicy] = None
    msg: Optional[str] = None
