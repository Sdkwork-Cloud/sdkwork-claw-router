from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_section_collection_response import AdminCourseSectionCollectionResponse


@dataclass
class CoursesSectionsListResult:
    """Courses sections list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseSectionCollectionResponse] = None
    msg: Optional[str] = None
