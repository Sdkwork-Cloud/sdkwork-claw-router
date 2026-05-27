from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseEngagementItem:
    """Admin course engagement item schema exposed by Claw Router."""
    id: str
    count: Optional[int] = None
    course_id: Optional[str] = None
    reaction_type: Optional[str] = None
    reaction_value: Optional[str] = None
    status: Optional[str] = None
