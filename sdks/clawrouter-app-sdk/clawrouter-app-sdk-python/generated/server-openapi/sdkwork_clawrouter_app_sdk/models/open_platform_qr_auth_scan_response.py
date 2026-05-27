from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformQrAuthScanResponse:
    """Open platform qr auth scan response schema exposed by Claw Router."""
    created_at: str
    id: str
    scan_source: str
    session_id: str
    session_key: str
    account_id: Optional[str] = None
    entry_id: Optional[str] = None
    external_user_id: Optional[str] = None
    ip_hash: Optional[str] = None
    user_agent: Optional[str] = None
