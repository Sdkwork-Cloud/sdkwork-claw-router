from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseEngagement:
    """Course engagement schema exposed by Claw Router."""
    discussions: str
    likes: str
    saves: str
    shares: str
    students_count: str
    views: str
