from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseCommentModerationRequest:
    """Admin course comment moderation request schema exposed by Claw Router."""
    status: str
    moderation_note: Optional[str] = None
