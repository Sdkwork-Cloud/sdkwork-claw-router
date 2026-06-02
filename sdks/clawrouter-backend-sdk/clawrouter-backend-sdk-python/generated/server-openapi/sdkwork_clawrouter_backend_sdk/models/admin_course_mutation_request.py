from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


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
    thumbnail: Optional[MediaResource] = None
    title: Optional[str] = None
