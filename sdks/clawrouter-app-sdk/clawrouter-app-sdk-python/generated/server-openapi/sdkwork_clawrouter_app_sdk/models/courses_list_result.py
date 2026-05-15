from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_list_response import CourseListResponse


@dataclass
class CoursesListResult:
    """Courses list result schema exposed by Claw Router."""
    code: str
    data: Optional[CourseListResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
