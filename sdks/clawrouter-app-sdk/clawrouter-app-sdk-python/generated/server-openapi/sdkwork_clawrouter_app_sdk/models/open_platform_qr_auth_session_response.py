from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_session_response import IamSessionResponse
    from .iam_user_response import IamUserResponse


@dataclass
class OpenPlatformQrAuthSessionResponse:
    """Open platform qr auth session response schema exposed by Claw Router."""
    created_at: str
    expires_at: str
    fallback_url: str
    id: str
    purpose: str
    qr_content: Dict[str, Any]
    session_key: str
    status: str
    updated_at: str
    completed_at: Optional[str] = None
    default_account_id: Optional[str] = None
    default_account_type: Optional[str] = None
    default_entry_id: Optional[str] = None
    default_provider: Optional[str] = None
    scanned_at: Optional[str] = None
    session: Optional[IamSessionResponse] = None
    token: Optional[IamSessionResponse] = None
    user_info: Optional[IamUserResponse] = None
