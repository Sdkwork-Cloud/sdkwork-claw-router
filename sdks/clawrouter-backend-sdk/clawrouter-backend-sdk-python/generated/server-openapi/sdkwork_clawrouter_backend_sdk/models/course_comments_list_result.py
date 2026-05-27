from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_comment_collection_response import AdminCourseCommentCollectionResponse


@dataclass
class CourseCommentsListResult:
    """Course comments list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseCommentCollectionResponse] = None
    msg: Optional[str] = None
