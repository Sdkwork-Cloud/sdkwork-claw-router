from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_application_review_response import AdminCourseApplicationReviewResponse


@dataclass
class CourseApplicationsReviewResult:
    """Course applications review result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseApplicationReviewResponse] = None
    msg: Optional[str] = None
