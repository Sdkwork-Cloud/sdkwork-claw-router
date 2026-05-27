from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_lesson_mutation_response import AdminCourseLessonMutationResponse


@dataclass
class CoursesLessonsCreateResult:
    """Courses lessons create result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseLessonMutationResponse] = None
    msg: Optional[str] = None
