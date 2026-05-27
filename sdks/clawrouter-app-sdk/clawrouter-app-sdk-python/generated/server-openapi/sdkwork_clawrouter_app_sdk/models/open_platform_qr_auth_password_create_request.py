from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformQrAuthPasswordCreateRequest:
    """Open platform qr auth password create request schema exposed by Claw Router."""
    password: str
    username: str
    channel: Optional[str] = None
    confirm_password: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    verification_code: Optional[str] = None
