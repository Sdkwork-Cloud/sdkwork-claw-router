from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformAccountUpdateRequest:
    """Open platform account update request schema exposed by Claw Router."""
    app_id: Optional[str] = None
    app_secret: Optional[str] = None
    default_entry_id: Optional[str] = None
    encoding_aes_key: Optional[str] = None
    name: Optional[str] = None
    qr_default: Optional[bool] = None
    status: Optional[str] = None
    token: Optional[str] = None
