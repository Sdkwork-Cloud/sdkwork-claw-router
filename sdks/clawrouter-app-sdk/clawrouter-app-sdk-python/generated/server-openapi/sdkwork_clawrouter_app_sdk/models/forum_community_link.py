from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ForumCommunityLink:
    """Forum community link schema exposed by Claw Router."""
    id: str
    label: str
    tone: str
    url: str
    qr_code_url: Optional[str] = None
