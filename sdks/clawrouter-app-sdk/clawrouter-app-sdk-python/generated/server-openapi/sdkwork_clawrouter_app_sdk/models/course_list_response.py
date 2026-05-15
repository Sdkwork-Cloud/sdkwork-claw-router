from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_item import CourseItem


@dataclass
class CourseListResponse:
    """Course list response schema exposed by Claw Router."""
    content: List[CourseItem]
    items: List[CourseItem]
    page: int
    size: int
    total_elements: int
