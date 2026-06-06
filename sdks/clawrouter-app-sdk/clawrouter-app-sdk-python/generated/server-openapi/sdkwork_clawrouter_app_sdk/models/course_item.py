from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_engagement import CourseEngagement
    from .course_instructor import CourseInstructor
    from .media_resource import MediaResource


@dataclass
class CourseItem:
    """Course item schema exposed by Claw Router."""
    category: str
    category_label: str
    comment_count: str
    content: str
    content_id: str
    course_code: str
    currency: str
    description: str
    duration_text: str
    engagement: CourseEngagement
    external_bvid: str
    id: str
    instructor: CourseInstructor
    is_collection: bool
    lessons_count: str
    level: str
    level_label: str
    published_at: str
    rating_score: float
    students_count: str
    tags: List[str]
    thumbnail: MediaResource
    title: str
    price_amount: Optional[str] = None
