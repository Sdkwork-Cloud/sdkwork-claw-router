from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseApplicationCreateResponse:
    """Course application create response schema exposed by Claw Router."""
    application_id: int
    category: str
    description: str
    id: str
    source_provider: str
    status: str
    submitted_at: str
    title: str
    contact_email: Optional[str] = None
    contact_name: Optional[str] = None
    external_bvid: Optional[str] = None
    video_url: Optional[str] = None
