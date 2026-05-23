from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_category_item import CourseCategoryItem


@dataclass
class CoursesCategoriesListResult:
    """Courses categories list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CourseCategoryItem]] = None
    msg: Optional[str] = None
