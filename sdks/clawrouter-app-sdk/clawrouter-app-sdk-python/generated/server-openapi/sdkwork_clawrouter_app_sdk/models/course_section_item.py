from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_lesson_item import CourseLessonItem


@dataclass
class CourseSectionItem:
    """Course section item schema exposed by Claw Router."""
    description: str
    duration_seconds: int
    id: str
    lesson_count: int
    lessons: List[CourseLessonItem]
    section_id: int
    section_no: int
    sort_order: int
    title: str
