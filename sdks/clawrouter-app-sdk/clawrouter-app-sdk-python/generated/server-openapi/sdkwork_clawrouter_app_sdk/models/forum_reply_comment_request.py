from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ForumReplyCommentRequest:
    """Forum reply comment request schema exposed by Claw Router."""
    content: str
    device_info: Optional[str] = None
