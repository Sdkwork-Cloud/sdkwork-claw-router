from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ForumCreateCommentRequest:
    """Forum create comment request schema exposed by Claw Router."""
    content: str
    content_id: str
    content_type: str
    device_info: Optional[str] = None
