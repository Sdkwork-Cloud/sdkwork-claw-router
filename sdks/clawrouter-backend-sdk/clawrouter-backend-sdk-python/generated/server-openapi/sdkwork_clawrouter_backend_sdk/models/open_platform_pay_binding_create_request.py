from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformPayBindingCreateRequest:
    """Open platform pay binding create request schema exposed by Claw Router."""
    mode: str
    payment_account_id: str
    scene: str
    payment_channel_id: Optional[str] = None
