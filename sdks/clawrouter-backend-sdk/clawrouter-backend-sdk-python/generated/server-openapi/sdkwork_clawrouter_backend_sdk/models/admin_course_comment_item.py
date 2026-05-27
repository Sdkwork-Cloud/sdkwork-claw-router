from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseCommentItem:
    """Admin course comment item schema exposed by Claw Router."""
    id: str
    author: Optional[str] = None
    content: Optional[str] = None
    course_id: Optional[str] = None
    created_at: Optional[str] = None
    status: Optional[str] = None
