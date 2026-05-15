from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamLoginQrCodeResponse:
    """Iam login qr code response schema exposed by Claw Router."""
    qr_content: str
    qr_key: str
    description: Optional[str] = None
    expire_time: Optional[int] = None
    qr_url: Optional[str] = None
    title: Optional[str] = None
    type: Optional[str] = None
