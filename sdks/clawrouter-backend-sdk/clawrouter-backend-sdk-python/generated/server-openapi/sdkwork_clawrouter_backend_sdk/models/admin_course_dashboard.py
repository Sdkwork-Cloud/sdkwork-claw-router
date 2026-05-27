from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseDashboard:
    """Admin course dashboard schema exposed by Claw Router."""
    draft_courses: int
    id: str
    published_courses: int
    review_queue: int
    total_comments: int
    total_courses: int
    total_engagement: int
    total_lessons: int
    total_students: int
