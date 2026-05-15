from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_application_video_upload_response import CourseApplicationVideoUploadResponse


@dataclass
class ApplicationsVideosCreateResult:
    """Applications videos create result schema exposed by Claw Router."""
    code: str
    data: Optional[CourseApplicationVideoUploadResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
