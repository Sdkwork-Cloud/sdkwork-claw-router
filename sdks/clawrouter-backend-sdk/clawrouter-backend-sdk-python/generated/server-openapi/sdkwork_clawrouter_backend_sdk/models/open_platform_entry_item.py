from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformEntryItem:
    """Open platform entry item schema exposed by Claw Router."""
    account_id: str
    id: str
    key: str
    status: str
    type: str
    url: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
