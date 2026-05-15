from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamPasswordResetCreateRequest:
    """Iam password reset create request schema exposed by Claw Router."""
    account: str
    code: str
    new_password: str
    confirm_password: Optional[str] = None
