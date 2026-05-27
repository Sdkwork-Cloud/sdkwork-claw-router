from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_qr_auth_session_response import OpenPlatformQrAuthSessionResponse


@dataclass
class QrAuthSessionsRetrieveResult:
    """Qr auth sessions retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformQrAuthSessionResponse] = None
    msg: Optional[str] = None
