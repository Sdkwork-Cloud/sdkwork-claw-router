from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class CourseLessonItem:
    """Course lesson item schema exposed by Claw Router."""
    content: str
    description: str
    duration_seconds: str
    duration_text: str
    external_bvid: str
    free_preview: bool
    id: str
    lesson_id: str
    lesson_no: str
    number: str
    sort_order: str
    source_provider: str
    title: str
    video: MediaResource
