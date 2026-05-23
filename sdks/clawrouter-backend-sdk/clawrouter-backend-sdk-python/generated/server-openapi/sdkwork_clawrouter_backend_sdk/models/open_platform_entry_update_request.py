from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformEntryUpdateRequest:
    """Open platform entry update request schema exposed by Claw Router."""
    key: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None
    url: Optional[str] = None
