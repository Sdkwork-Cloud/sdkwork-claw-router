from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamPasswordResetRequestResponse:
    """Iam password reset request response schema exposed by Claw Router."""
    debug_code: Optional[str] = None
    expires_at: Optional[str] = None
    request_id: Optional[str] = None
