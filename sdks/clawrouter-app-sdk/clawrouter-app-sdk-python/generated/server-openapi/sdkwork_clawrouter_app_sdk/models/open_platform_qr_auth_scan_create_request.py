from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformQrAuthScanCreateRequest:
    """Open platform qr auth scan create request schema exposed by Claw Router."""
    scan_source: str
    account_id: Optional[str] = None
    entry_id: Optional[str] = None
    external_user_id: Optional[str] = None
    ip_hash: Optional[str] = None
    user_agent: Optional[str] = None
