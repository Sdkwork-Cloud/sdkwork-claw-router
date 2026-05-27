from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_application_collection_response import AdminCourseApplicationCollectionResponse


@dataclass
class CourseApplicationsListResult:
    """Course applications list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseApplicationCollectionResponse] = None
    msg: Optional[str] = None
