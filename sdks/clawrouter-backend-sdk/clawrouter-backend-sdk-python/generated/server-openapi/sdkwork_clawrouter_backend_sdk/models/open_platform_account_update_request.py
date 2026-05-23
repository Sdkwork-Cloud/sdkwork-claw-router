from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformAccountUpdateRequest:
    """Open platform account update request schema exposed by Claw Router."""
    aes_key_ref: Optional[str] = None
    app_id: Optional[str] = None
    default_entry_id: Optional[str] = None
    name: Optional[str] = None
    qr_default: Optional[bool] = None
    secret_ref: Optional[str] = None
    status: Optional[str] = None
    token_ref: Optional[str] = None
