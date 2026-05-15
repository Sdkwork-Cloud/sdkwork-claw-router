from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamPasswordResetRequestCreateRequest:
    """Iam password reset request create request schema exposed by Claw Router."""
    account: str
    channel: str
