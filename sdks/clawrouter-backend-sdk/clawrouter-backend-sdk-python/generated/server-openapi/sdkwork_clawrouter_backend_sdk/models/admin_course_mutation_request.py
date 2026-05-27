from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseMutationRequest:
    """Admin course mutation request schema exposed by Claw Router."""
    category: Optional[str] = None
    course_code: Optional[str] = None
    description: Optional[str] = None
    instructor_snapshot: Optional[Dict[str, str]] = None
    level: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    thumbnail_url: Optional[str] = None
    title: Optional[str] = None
