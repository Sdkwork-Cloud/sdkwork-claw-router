from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseRelationItem:
    """Admin course relation item schema exposed by Claw Router."""
    id: str
    course_id: Optional[str] = None
    related_course_id: Optional[str] = None
    relation_type: Optional[str] = None
    sort_order: Optional[str] = None
    status: Optional[str] = None
