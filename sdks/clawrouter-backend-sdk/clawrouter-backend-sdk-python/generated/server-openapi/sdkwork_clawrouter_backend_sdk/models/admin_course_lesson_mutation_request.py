from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseLessonMutationRequest:
    """Admin course lesson mutation request schema exposed by Claw Router."""
    description: Optional[str] = None
    duration_seconds: Optional[int] = None
    external_bvid: Optional[str] = None
    free_preview: Optional[bool] = None
    lesson_no: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    section_id: Optional[str] = None
    status: Optional[str] = None
    title: Optional[str] = None
    video_url: Optional[str] = None
