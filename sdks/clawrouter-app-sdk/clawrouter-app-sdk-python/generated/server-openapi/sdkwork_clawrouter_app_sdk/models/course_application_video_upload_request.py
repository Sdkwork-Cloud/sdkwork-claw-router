from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseApplicationVideoUploadRequest:
    """Course application video upload request schema exposed by Claw Router."""
    file: str
    file_name: Optional[str] = None
