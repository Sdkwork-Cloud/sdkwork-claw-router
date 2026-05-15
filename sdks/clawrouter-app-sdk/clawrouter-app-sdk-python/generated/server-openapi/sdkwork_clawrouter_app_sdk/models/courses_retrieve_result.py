from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_detail import CourseDetail


@dataclass
class CoursesRetrieveResult:
    """Courses retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CourseDetail] = None
    message: Optional[str] = None
    msg: Optional[str] = None
