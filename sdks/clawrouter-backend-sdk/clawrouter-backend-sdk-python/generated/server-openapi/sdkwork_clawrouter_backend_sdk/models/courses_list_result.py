from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_collection_response import AdminCourseCollectionResponse


@dataclass
class CoursesListResult:
    """Courses list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseCollectionResponse] = None
    msg: Optional[str] = None
