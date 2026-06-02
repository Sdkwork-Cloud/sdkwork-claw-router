from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class ForumCommunityLink:
    """Forum community link schema exposed by Claw Router."""
    id: str
    label: str
    tone: str
    url: str
    qr_code: Optional[MediaResource] = None
