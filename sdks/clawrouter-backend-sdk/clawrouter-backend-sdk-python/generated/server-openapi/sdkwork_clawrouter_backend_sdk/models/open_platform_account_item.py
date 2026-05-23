from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformAccountItem:
    """Open platform account item schema exposed by Claw Router."""
    id: str
    key: str
    name: str
    provider: str
    qr_default: bool
    status: str
    type: str
    aes_key_ref: Optional[str] = None
    app_id: Optional[str] = None
    created_at: Optional[str] = None
    default_entry_id: Optional[str] = None
    secret_ref: Optional[str] = None
    token_ref: Optional[str] = None
    updated_at: Optional[str] = None
