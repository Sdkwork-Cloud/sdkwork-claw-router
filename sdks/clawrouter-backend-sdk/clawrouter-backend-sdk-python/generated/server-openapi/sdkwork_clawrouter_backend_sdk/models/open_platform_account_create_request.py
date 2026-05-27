from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformAccountCreateRequest:
    """Open platform account create request schema exposed by Claw Router."""
    key: str
    name: str
    provider: str
    type: str
    app_id: Optional[str] = None
    app_secret: Optional[str] = None
    encoding_aes_key: Optional[str] = None
    token: Optional[str] = None
