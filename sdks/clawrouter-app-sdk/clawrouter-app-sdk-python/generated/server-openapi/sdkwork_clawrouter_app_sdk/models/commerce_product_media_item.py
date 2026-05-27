from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductMediaItem:
    """Commerce product media item schema exposed by Claw Router."""
    id: str
    media_type: str
    owner_id: str
    owner_type: str
    sort_order: int
    status: str
    url: str
    alt_text: Optional[str] = None
