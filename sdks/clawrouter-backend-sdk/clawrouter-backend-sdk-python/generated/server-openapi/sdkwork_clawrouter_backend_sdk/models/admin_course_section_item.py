from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseSectionItem:
    """Admin course section item schema exposed by Claw Router."""
    id: str
    course_id: Optional[str] = None
    status: Optional[str] = None
    title: Optional[str] = None
