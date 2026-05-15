from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_overview import CourseOverview


@dataclass
class CoursesOverviewRetrieveResult:
    """Courses overview retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CourseOverview] = None
    message: Optional[str] = None
    msg: Optional[str] = None
