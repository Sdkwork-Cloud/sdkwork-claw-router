from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseLessonItem:
    """Course lesson item schema exposed by Claw Router."""
    content: str
    description: str
    duration_seconds: int
    duration_text: str
    external_bvid: str
    free_preview: bool
    id: str
    lesson_id: int
    lesson_no: int
    number: int
    sort_order: int
    source_provider: str
    title: str
    video_url: str
