from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_lesson_item import AdminCourseLessonItem


@dataclass
class AdminCourseLessonMutationResponse:
    """Admin course lesson mutation response schema exposed by Claw Router."""
    item: AdminCourseLessonItem
