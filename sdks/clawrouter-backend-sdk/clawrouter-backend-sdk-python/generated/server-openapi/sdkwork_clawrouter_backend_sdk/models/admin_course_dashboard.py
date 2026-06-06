from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseDashboard:
    """Admin course dashboard schema exposed by Claw Router."""
    draft_courses: str
    id: str
    published_courses: str
    review_queue: str
    total_comments: str
    total_courses: str
    total_engagement: str
    total_lessons: str
    total_students: str
