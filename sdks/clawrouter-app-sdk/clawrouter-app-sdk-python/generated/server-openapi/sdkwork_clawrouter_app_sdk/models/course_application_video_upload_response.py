from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseApplicationVideoUploadResponse:
    """Course application video upload response schema exposed by Claw Router."""
    content_type: str
    file_name: str
    sha256: str
    size_bytes: int
    uploaded_at: str
    video_url: str
