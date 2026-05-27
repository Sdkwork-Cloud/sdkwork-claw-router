from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_relation_collection_response import AdminCourseRelationCollectionResponse


@dataclass
class CoursesRelationsReplaceResult:
    """Courses relations replace result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseRelationCollectionResponse] = None
    msg: Optional[str] = None
