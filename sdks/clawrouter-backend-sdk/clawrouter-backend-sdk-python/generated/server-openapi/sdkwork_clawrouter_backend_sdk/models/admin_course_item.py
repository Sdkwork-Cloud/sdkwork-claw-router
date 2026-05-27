from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseItem:
    """Admin course item schema exposed by Claw Router."""
    id: str
    course_code: Optional[str] = None
    status: Optional[str] = None
    title: Optional[str] = None
