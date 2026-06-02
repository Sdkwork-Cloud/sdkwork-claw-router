from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class CommerceProductMediaItem:
    """Commerce product media item schema exposed by Claw Router."""
    id: str
    media_role: str
    owner_id: str
    owner_type: str
    resource: MediaResource
    sort_order: int
    status: str
    alt_text: Optional[str] = None
