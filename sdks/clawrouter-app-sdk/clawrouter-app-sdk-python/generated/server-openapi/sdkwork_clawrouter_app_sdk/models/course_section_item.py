from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_lesson_item import CourseLessonItem


@dataclass
class CourseSectionItem:
    """Course section item schema exposed by Claw Router."""
    description: str
    duration_seconds: str
    id: str
    lesson_count: str
    lessons: List[CourseLessonItem]
    section_id: str
    section_no: str
    sort_order: str
    title: str
