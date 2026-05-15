from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseOverviewStats:
    """Course overview stats schema exposed by Claw Router."""
    total_categories: int
    total_courses: int
    total_lessons: int
    total_students: int
