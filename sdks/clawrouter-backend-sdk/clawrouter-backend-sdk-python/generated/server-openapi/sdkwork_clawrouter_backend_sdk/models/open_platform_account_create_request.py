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
    aes_key_ref: Optional[str] = None
    app_id: Optional[str] = None
    secret_ref: Optional[str] = None
    token_ref: Optional[str] = None
