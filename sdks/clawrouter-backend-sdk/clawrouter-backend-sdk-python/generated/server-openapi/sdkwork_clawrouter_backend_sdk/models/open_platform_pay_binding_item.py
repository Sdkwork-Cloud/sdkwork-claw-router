from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformPayBindingItem:
    """Open platform pay binding item schema exposed by Claw Router."""
    account_id: str
    id: str
    mode: str
    payment_account_id: str
    scene: str
    status: str
    created_at: Optional[str] = None
    payment_channel_id: Optional[str] = None
    updated_at: Optional[str] = None
