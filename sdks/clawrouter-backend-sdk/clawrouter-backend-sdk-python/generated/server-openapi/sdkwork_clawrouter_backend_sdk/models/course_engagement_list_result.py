from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_engagement_collection_response import AdminCourseEngagementCollectionResponse


@dataclass
class CourseEngagementListResult:
    """Course engagement list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseEngagementCollectionResponse] = None
    msg: Optional[str] = None
