from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseEngagement:
    """Course engagement schema exposed by Claw Router."""
    discussions: int
    likes: int
    saves: int
    shares: int
    students_count: int
    views: int
