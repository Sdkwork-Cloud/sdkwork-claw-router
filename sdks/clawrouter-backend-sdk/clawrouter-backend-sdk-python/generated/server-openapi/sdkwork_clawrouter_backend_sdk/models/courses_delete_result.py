from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_delete_response import AdminCourseDeleteResponse


@dataclass
class CoursesDeleteResult:
    """Courses delete result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseDeleteResponse] = None
    msg: Optional[str] = None
