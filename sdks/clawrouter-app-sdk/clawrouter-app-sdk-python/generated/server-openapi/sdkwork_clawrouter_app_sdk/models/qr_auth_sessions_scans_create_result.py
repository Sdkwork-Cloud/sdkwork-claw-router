from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_qr_auth_scan_response import OpenPlatformQrAuthScanResponse


@dataclass
class QrAuthSessionsScansCreateResult:
    """Qr auth sessions scans create result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformQrAuthScanResponse] = None
    msg: Optional[str] = None
